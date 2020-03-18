using Microsoft.EntityFrameworkCore.Migrations;

namespace Shared.Migrations
{
    public partial class CharacterOnProfiles : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ActiveCharacterName",
                table: "SnapshotProfiles",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IncludeEquipment",
                table: "SnapshotProfiles",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IncludeInventory",
                table: "SnapshotProfiles",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ActiveCharacterName",
                table: "SnapshotProfiles");

            migrationBuilder.DropColumn(
                name: "IncludeEquipment",
                table: "SnapshotProfiles");

            migrationBuilder.DropColumn(
                name: "IncludeInventory",
                table: "SnapshotProfiles");
        }
    }
}
