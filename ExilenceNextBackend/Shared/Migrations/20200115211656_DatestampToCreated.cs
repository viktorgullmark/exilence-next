using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Shared.Migrations
{
    public partial class DatestampToCreated : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Datestamp",
                table: "Snapshots");

            migrationBuilder.DropColumn(
                name: "Datestamp",
                table: "Connections");

            migrationBuilder.DropColumn(
                name: "Datestamp",
                table: "Accounts");

            migrationBuilder.AddColumn<DateTime>(
                name: "Created",
                table: "Snapshots",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "Created",
                table: "SnapshotProfiles",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "Created",
                table: "Connections",
                maxLength: 20,
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "Created",
                table: "Accounts",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Created",
                table: "Snapshots");

            migrationBuilder.DropColumn(
                name: "Created",
                table: "SnapshotProfiles");

            migrationBuilder.DropColumn(
                name: "Created",
                table: "Connections");

            migrationBuilder.DropColumn(
                name: "Created",
                table: "Accounts");

            migrationBuilder.AddColumn<DateTime>(
                name: "Datestamp",
                table: "Snapshots",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "Datestamp",
                table: "Connections",
                type: "datetime2",
                maxLength: 20,
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "Datestamp",
                table: "Accounts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
