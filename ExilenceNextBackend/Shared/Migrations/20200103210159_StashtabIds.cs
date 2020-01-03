using Microsoft.EntityFrameworkCore.Migrations;

namespace Shared.Migrations
{
    public partial class StashtabIds : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ClientId",
                table: "StashTabs",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AddColumn<string>(
                name: "StashTabId",
                table: "StashTabs",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StashTabId",
                table: "StashTabs");

            migrationBuilder.AlterColumn<string>(
                name: "ClientId",
                table: "StashTabs",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 50);
        }
    }
}
