using Microsoft.EntityFrameworkCore.Migrations;

namespace Shared.Migrations
{
    public partial class UpdatedPricedItem : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TotalStackSize",
                table: "PricedItems",
                newName: "TotalStacksize");

            migrationBuilder.AlterColumn<decimal>(
                name: "Mode",
                table: "PricedItems",
                type: "decimal(13,4)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(13,4)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Min",
                table: "PricedItems",
                type: "decimal(13,4)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(13,4)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Median",
                table: "PricedItems",
                type: "decimal(13,4)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(13,4)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Mean",
                table: "PricedItems",
                type: "decimal(13,4)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(13,4)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Max",
                table: "PricedItems",
                type: "decimal(13,4)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(13,4)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Ilvl",
                table: "PricedItems",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(13,4)");

            migrationBuilder.AlterColumn<int>(
                name: "FrameType",
                table: "PricedItems",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Calculated",
                table: "PricedItems",
                type: "decimal(13,4)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(13,4)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BaseType",
                table: "PricedItems",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Count",
                table: "PricedItems",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "Total",
                table: "PricedItems",
                type: "decimal(13,4)",
                nullable: false,
                defaultValue: 0m);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BaseType",
                table: "PricedItems");

            migrationBuilder.DropColumn(
                name: "Count",
                table: "PricedItems");

            migrationBuilder.DropColumn(
                name: "Total",
                table: "PricedItems");

            migrationBuilder.RenameColumn(
                name: "TotalStacksize",
                table: "PricedItems",
                newName: "TotalStackSize");

            migrationBuilder.AlterColumn<decimal>(
                name: "Mode",
                table: "PricedItems",
                type: "decimal(13,4)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(13,4)");

            migrationBuilder.AlterColumn<decimal>(
                name: "Min",
                table: "PricedItems",
                type: "decimal(13,4)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(13,4)");

            migrationBuilder.AlterColumn<decimal>(
                name: "Median",
                table: "PricedItems",
                type: "decimal(13,4)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(13,4)");

            migrationBuilder.AlterColumn<decimal>(
                name: "Mean",
                table: "PricedItems",
                type: "decimal(13,4)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(13,4)");

            migrationBuilder.AlterColumn<decimal>(
                name: "Max",
                table: "PricedItems",
                type: "decimal(13,4)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(13,4)");

            migrationBuilder.AlterColumn<decimal>(
                name: "Ilvl",
                table: "PricedItems",
                type: "decimal(13,4)",
                nullable: false,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<string>(
                name: "FrameType",
                table: "PricedItems",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<decimal>(
                name: "Calculated",
                table: "PricedItems",
                type: "decimal(13,4)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(13,4)");
        }
    }
}
