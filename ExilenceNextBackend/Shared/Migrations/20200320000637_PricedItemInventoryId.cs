using Microsoft.EntityFrameworkCore.Migrations;

namespace Shared.Migrations
{
    public partial class PricedItemInventoryId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "InventoryId",
                table: "PricedItems",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InventoryId",
                table: "PricedItems");
        }
    }
}
