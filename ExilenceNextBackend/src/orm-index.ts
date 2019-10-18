import "reflect-metadata";
import { createConnection } from "typeorm";
import { Account } from "./entity/Account";


createConnection().then(async connection => {

    console.log("Inserting a new user into the database...");
    const account = new Account();
    account.name = "Timber";
    await connection.manager.save(account);
    console.log("Saved a new user with id: " + account.id);

    console.log("Loading users from the database...");
    const users = await connection.manager.find(Account);
    console.log("Loaded users: ", users);

    console.log("Here you can setup and run express/koa/any other framework.");

}).catch(error => console.log(error));
