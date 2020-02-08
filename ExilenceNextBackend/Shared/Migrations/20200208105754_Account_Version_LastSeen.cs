using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Shared.Migrations
{
    public partial class Account_Version_LastSeen : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastLogin",
                table: "Accounts",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Version",
                table: "Accounts",
                nullable: true);


            migrationBuilder.Sql("UPDATE Accounts set LastLogin = Created");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastLogin",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "Accounts");
        }
    }
}
