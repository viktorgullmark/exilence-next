using Microsoft.EntityFrameworkCore.Migrations;

namespace Shared.Migrations
{
    public partial class UpdatedSnapshotModels : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalValue",
                table: "Snapshots");

            migrationBuilder.AddColumn<decimal>(
                name: "Value",
                table: "StashTabs",
                type: "decimal",
                nullable: false,
                defaultValue: 0m);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Value",
                table: "StashTabs");

            migrationBuilder.AddColumn<decimal>(
                name: "TotalValue",
                table: "Snapshots",
                type: "decimal",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
