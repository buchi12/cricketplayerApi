const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const app = express();
let database = null;
const dbPath = path.join(__dirname, "cricketMathDetails.db");
app.use(express.json());

const initializeDbAndServer = async () => {
  try {
    database = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  } catch (error) {
    console.log(`Data base error is ${error}`);
    process.exit(1);
  }
};
initializeDbAndServer();

//API1

const API1 = (object1) => {
  return {
    playerId: object1.player_id,
    playerName: object1.player_name,
  };
};

app.get("/players/", async (request, response) => {
  try {
    const sqlForApi1 = `
      SELECT 
         * 
       FROM 
         player_details;
    `;
    const runSql = await database.all(sqlForApi1);
    response.send(runSql.map((eachMovie) => API1(eachMovie)));
  } catch (e) {
    response.send(`Db ${e.message}`);
  }
});

//API2

const API2 = (object2) => {
  return {
    playerId: object2.player_id,
    playerName: object2.player_name,
  };
};

app.get("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const sqlForApi2 = `
      SELECT
        * 
       FROM 
         player_details
        WHERE 
          player_id=${playerId};
    `;
  const arrayForApi2 = await database.get(sqlForApi2);
  response.send(API2(arrayForApi2));
});

//API3

app.put("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const { playerName } = request.body;
  const sqlForApi3 = `
      UPDATE player_details SET player_id=${playerId},
      player_Name=${playerName}
    `;
  const dataResult = await database.get(sqlForApi3);
  response.send("Player Details Updated");
});

//API4
const API4 = (object4) => {
  return {
    matchId: object4.match_id,
    match: object4.match,
    year: object4.year,
  };
};

app.get("/matches/:matchId", async (request, response) => {
  const { matchId } = request.params;
  const sqlForApi4 = `
      SELECT  * FROM match_details WHERE match_id=${matchId};
    `;
  const resultSql = await database.get(sqlForApi4);
  response.send(API4(resultSql));
});

//API5

const Api5 = (object) => {
  return {
    matchId: object.match_id,
    match: object.match,
    year: object.year,
  };
};

app.get("/players/:playerId/matches", async (request, response) => {
  const { playerId } = request.params;
  const sqlForApi5 = `
      select * from player_match_score NATURAL JOIN match_details

      where player_id=${playerId};
    `;
  const resultSql = await database.all(sqlForApi5);
  response.send((resultSql = (each) => Api5(each)));
});

//API6
const Api6 = (object6) => {
  return {
    playerId: object6.player_id,
    playerName: object6.player_name,
  };
};

app.get("/matches/:matchId/players", async (request, response) => {
  const { matchId } = request.params;
  const sqlForApi6 = `
       select * from player_details NATURAL JOIN player_match_score
       where match_id=${matchId};
    `;
  const resultSql6 = await database.all(sqlForApi6);
  response.send(resultSql6((each) => Api6(each)));
});

//API 7

app.get("/players/:playerId/playerScore", async (request, response) => {
  const { playerId } = request.params;
  const sqlForApi7 = `
        SELECT player_id,
        player_name as playerName,
        sum(score), sum(fours),sum(sixes) 
        from player_match_score NATURAL JOIN player_details
        where player_id=${playerId};
    `;
  const resultSql7 = await database.get(aqlForApi7);
  response.send({
    playerId: resultSql7["player_id"],
    playerName: resultSql7["playerName"],
    totalScore: resultSql7["sum(score)"],
    totalFours: resultSql7["sum(fours)"],
    totalSixes: resultSql7["sum(sixes)"],
  });
});

module.exports = app;
