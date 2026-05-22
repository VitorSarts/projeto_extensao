const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

dotenv.config();

const application = express();

application.use(cors());
application.use(express.json());

const databasePool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
});

application.get("/health", async (request, response) => {
  try {
    const [databaseRows] = await databasePool.execute("SELECT 1 AS status_value");

    return response.json({
      ok: true,
      database: databaseRows[0],
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      ok: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

application.post("/login", async (request, response) => {
  try {
    const { emailAddress, password } = request.body;

    if (!emailAddress || !password) {
      return response.status(400).json({
        message: "E-mail e senha são obrigatórios.",
      });
    }

    const [userRows] = await databasePool.execute(
      `
      SELECT
        id_nao_socio,
        nome_completo,
        email,
        senha_hash
      FROM visitantes_eventos.cadastro_completo_nao_socios
      WHERE email = ?
      LIMIT 1
      `,
      [emailAddress]
    );

    if (userRows.length === 0) {
      return response.status(404).json({
        message: "Usuário não encontrado.",
      });
    }

    const user = userRows[0];

    if (!user.senha_hash) {
      return response.status(401).json({
        message: "Senha não cadastrada para este usuário.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.senha_hash);

    if (!passwordMatch) {
      return response.status(401).json({
        message: "Senha incorreta.",
      });
    }

    return response.json({
      message: "Login realizado com sucesso.",
      user: {
        id_nao_socio: user.id_nao_socio,
        nome_completo: user.nome_completo,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

application.post("/member-login", async (request, response) => {
  try {
    const { memberIdentifier, password } = request.body;

    if (!memberIdentifier || !password) {
      return response.status(400).json({
        message: "Número da carteirinha e senha são obrigatórios.",
      });
    }

    const [memberRows] = await databasePool.execute(
      `
      SELECT
        id_socio,
        numero_carteirinha,
        nome_completo,
        email_login,
        senha_hash
      FROM clube_socios.socios_login
      WHERE numero_carteirinha = ?
      LIMIT 1
      `,
      [memberIdentifier]
    );

    if (memberRows.length === 0) {
      return response.status(404).json({
        message: "Sócio não encontrado.",
      });
    }

    const member = memberRows[0];

    if (!member.senha_hash) {
      return response.status(401).json({
        message: "Senha não cadastrada para este sócio.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, member.senha_hash);

    if (!passwordMatch) {
      return response.status(401).json({
        message: "Senha incorreta.",
      });
    }

    return response.json({
      message: "Login realizado com sucesso.",
      member: {
        id_socio: member.id_socio,
        numero_carteirinha: member.numero_carteirinha,
        nome_completo: member.nome_completo,
        email_login: member.email_login,
      },
    });
  } catch (error) {
    console.error("Request error:", error);
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

application.post("/register", async (request, response) => {
  try {
    const { firstName, lastName, emailAddress, password, cpf, phoneNumber } = request.body;

    if (
      !firstName || !firstName.trim() ||
      !lastName  || !lastName.trim()  ||
      !emailAddress || !emailAddress.trim() ||
      !password  || !password.trim()  ||
      !cpf       || !cpf.trim()       ||
      !phoneNumber || !phoneNumber.trim()
    ) {
      return response.status(400).json({
        message: "Nome, sobrenome, e-mail, senha, CPF e telefone são obrigatórios.",
      });
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const senhaHash = await bcrypt.hash(password, SALT_ROUNDS);

    await databasePool.execute(
      `
      INSERT INTO visitantes_eventos.cadastro_completo_nao_socios
      (
        nome_completo,
        cpf,
        telefone,
        email,
        senha_hash,
        origem_cadastro
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [fullName, cpf.trim(), phoneNumber.trim(), emailAddress.trim(), senhaHash, "site"]
    );

    return response.status(201).json({
      message: "Cadastro realizado com sucesso.",
    });
  } catch (error) {
    console.error(error);

    if (error.code === "ER_DUP_ENTRY") {
      if (error.message.includes("email")) {
        return response.status(409).json({
          message: "Este e-mail já está cadastrado.",
        });
      }
      if (error.message.includes("cpf")) {
        return response.status(409).json({
          message: "Este CPF já está cadastrado.",
        });
      }
      return response.status(409).json({
        message: "Dados duplicados. Verifique e-mail e CPF.",
      });
    }

    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

application.get("/espacos", async (request, response) => {
  try {
    const [spaceRows] = await databasePool.execute(
      `
      SELECT
        id_espaco,
        nome,
        capacidade_maxima,
        preco_base,
        descricao,
        status_ativo
      FROM gestao_espacos.espacos
      WHERE status_ativo = TRUE
      ORDER BY id_espaco ASC
      `
    );

    return response.json({
      espacos: spaceRows,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

application.post("/reservas", async (request, response) => {
  const connection = await databasePool.getConnection();

  try {
    const { tipoCliente, idCliente, idEspaco, dataUso } = request.body;

    // --- validação 400 ---
    if (
      !tipoCliente || !String(tipoCliente).trim() ||
      !idCliente   ||
      !idEspaco    ||
      !dataUso     || !String(dataUso).trim()
    ) {
      connection.release();
      return response.status(400).json({
        message: "tipoCliente, idCliente, idEspaco e dataUso são obrigatórios.",
      });
    }

    if (tipoCliente !== "socio" && tipoCliente !== "nao_socio") {
      connection.release();
      return response.status(400).json({
        message: "tipoCliente deve ser 'socio' ou 'nao_socio'.",
      });
    }

    // --- verificar disponibilidade na agenda_global ---
    const [agendaRows] = await connection.execute(
      `
      SELECT id_agenda
      FROM gestao_espacos.agenda_global
      WHERE id_espaco = ? AND data_reservada = ?
      LIMIT 1
      `,
      [idEspaco, dataUso]
    );

    if (agendaRows.length > 0) {
      connection.release();
      return response.status(409).json({
        message: "Este espaço já está reservado para a data informada.",
      });
    }

    // --- buscar valor na tabela_precos ---
    const [precoRows] = await connection.execute(
      `
      SELECT valor_cobrado
      FROM gestao_espacos.tabela_precos
      WHERE id_espaco = ? AND tipo_cliente = ?
      LIMIT 1
      `,
      [idEspaco, tipoCliente]
    );

    const valorCobrado = precoRows.length > 0
      ? precoRows[0].valor_cobrado
      : null;

    // --- transaction: inserir reserva + agenda juntos ---
    await connection.beginTransaction();

    let idReservaCriada;

    if (tipoCliente === "socio") {
      const [insertResult] = await connection.execute(
        `
        INSERT INTO clube_socios.reservas_socios
          (id_socio, id_espaco, data_uso, valor_com_desconto)
        VALUES (?, ?, ?, ?)
        `,
        [idCliente, idEspaco, dataUso, valorCobrado]
      );
      idReservaCriada = insertResult.insertId;
    } else {
      const [insertResult] = await connection.execute(
        `
        INSERT INTO visitantes_eventos.reservas_nao_socios
          (id_nao_socio, id_espaco, data_uso, valor_cheio, status_pagamento)
        VALUES (?, ?, ?, ?, 'pendente')
        `,
        [idCliente, idEspaco, dataUso, valorCobrado]
      );
      idReservaCriada = insertResult.insertId;
    }

    await connection.execute(
      `
      INSERT INTO gestao_espacos.agenda_global
        (id_espaco, data_reservada, origem_reserva)
      VALUES (?, ?, ?)
      `,
      [idEspaco, dataUso, tipoCliente]
    );

    await connection.commit();
    connection.release();

    return response.status(201).json({
      message: "Reserva criada com sucesso.",
      reserva: {
        id: idReservaCriada,
        tipoCliente,
        idCliente,
        idEspaco,
        dataUso,
        valorCobrado,
      },
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error(error);

    if (error.code === "ER_DUP_ENTRY") {
      return response.status(409).json({
        message: "Este espaço já está reservado para a data informada.",
      });
    }

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return response.status(400).json({
        message: "Cliente ou espaço não encontrado no banco de dados.",
      });
    }

    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

application.post("/admin/usuarios", async (request, response) => {
  try {
    const {
      userType,
      fullName,
      emailAddress,
      password,
      cpf,
      phoneNumber,
      membershipNumber,
    } = request.body;

    // --- validação: tipo obrigatório ---
    if (userType !== "socio" && userType !== "nao_socio") {
      return response.status(400).json({
        message: "userType deve ser 'socio' ou 'nao_socio'.",
      });
    }

    // --- hash de senha (se fornecida) ---
    const senhaHash = password && password.trim()
      ? await bcrypt.hash(password.trim(), SALT_ROUNDS)
      : null;

    if (userType === "nao_socio") {
      // Campos obrigatórios para não-sócio
      if (
        !fullName    || !fullName.trim()    ||
        !emailAddress || !emailAddress.trim() ||
        !cpf         || !cpf.trim()         ||
        !phoneNumber || !phoneNumber.trim()
      ) {
        return response.status(400).json({
          message: "Para não sócio, nome, e-mail, CPF e telefone são obrigatórios.",
        });
      }

      await databasePool.execute(
        `
        INSERT INTO visitantes_eventos.cadastro_completo_nao_socios
          (nome_completo, cpf, telefone, email, senha_hash, origem_cadastro)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          fullName.trim(),
          cpf.trim(),
          phoneNumber.trim(),
          emailAddress.trim(),
          senhaHash,
          "admin",
        ]
      );

      return response.status(201).json({
        message: "Não sócio cadastrado com sucesso.",
      });
    }

    // userType === "socio"
    if (
      !fullName       || !fullName.trim()       ||
      !emailAddress   || !emailAddress.trim()   ||
      !membershipNumber || !membershipNumber.trim()
    ) {
      return response.status(400).json({
        message: "Para sócio, nome, e-mail e número da carteirinha são obrigatórios.",
      });
    }

    await databasePool.execute(
      `
      INSERT INTO clube_socios.socios_login
        (numero_carteirinha, nome_completo, email_login, senha_hash)
      VALUES (?, ?, ?, ?)
      `,
      [
        membershipNumber.trim(),
        fullName.trim(),
        emailAddress.trim(),
        senhaHash,
      ]
    );

    return response.status(201).json({
      message: "Sócio cadastrado com sucesso.",
    });
  } catch (error) {
    console.error(error);

    if (error.code === "ER_DUP_ENTRY") {
      if (error.message.includes("email") || error.message.includes("email_login")) {
        return response.status(409).json({
          message: "Este e-mail já está cadastrado.",
        });
      }
      if (error.message.includes("cpf")) {
        return response.status(409).json({
          message: "Este CPF já está cadastrado.",
        });
      }
      if (error.message.includes("numero_carteirinha")) {
        return response.status(409).json({
          message: "Este número de carteirinha já está cadastrado.",
        });
      }
      return response.status(409).json({
        message: "Dados duplicados. Verifique e-mail, CPF ou carteirinha.",
      });
    }

    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

application.post("/admin-login", async (request, response) => {
  try {
    const { adminIdentifier, password } = request.body;

    return response.json({
      message: "Admin login successful",
      admin: {
        adminIdentifier,
      },
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: "Internal server error",
    });
  }
});

const portNumber = process.env.PORT || 3001;

application.listen(portNumber, () => {
  console.log(`Server running on port ${portNumber}`);
});