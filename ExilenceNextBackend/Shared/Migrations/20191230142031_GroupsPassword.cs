using Microsoft.EntityFrameworkCore.Migrations;

namespace Shared.Migrations
{
    public partial class GroupsPassword : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Hash",
                table: "Groups",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Salt",
                table: "Groups",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Hash",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "Salt",
                table: "Groups");
        }
    }
}
