using Microsoft.EntityFrameworkCore.Migrations;

namespace Shared.Migrations
{
    public partial class CascadeDelete : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Characters_Accounts_AccountId",
                table: "Characters");

            migrationBuilder.DropForeignKey(
                name: "FK_PricedItems_StashTabs_StashtabId",
                table: "PricedItems");

            migrationBuilder.DropForeignKey(
                name: "FK_SnapshotProfiles_Accounts_AccountId",
                table: "SnapshotProfiles");

            migrationBuilder.DropForeignKey(
                name: "FK_Snapshots_SnapshotProfiles_ProfileId",
                table: "Snapshots");

            migrationBuilder.DropForeignKey(
                name: "FK_StashTabs_Snapshots_SnapshotId",
                table: "StashTabs");

            migrationBuilder.AlterColumn<int>(
                name: "SnapshotId",
                table: "StashTabs",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ProfileId",
                table: "Snapshots",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "AccountId",
                table: "SnapshotProfiles",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "StashtabId",
                table: "PricedItems",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "AccountId",
                table: "Characters",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Characters_Accounts_AccountId",
                table: "Characters",
                column: "AccountId",
                principalTable: "Accounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PricedItems_StashTabs_StashtabId",
                table: "PricedItems",
                column: "StashtabId",
                principalTable: "StashTabs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SnapshotProfiles_Accounts_AccountId",
                table: "SnapshotProfiles",
                column: "AccountId",
                principalTable: "Accounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Snapshots_SnapshotProfiles_ProfileId",
                table: "Snapshots",
                column: "ProfileId",
                principalTable: "SnapshotProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StashTabs_Snapshots_SnapshotId",
                table: "StashTabs",
                column: "SnapshotId",
                principalTable: "Snapshots",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Characters_Accounts_AccountId",
                table: "Characters");

            migrationBuilder.DropForeignKey(
                name: "FK_PricedItems_StashTabs_StashtabId",
                table: "PricedItems");

            migrationBuilder.DropForeignKey(
                name: "FK_SnapshotProfiles_Accounts_AccountId",
                table: "SnapshotProfiles");

            migrationBuilder.DropForeignKey(
                name: "FK_Snapshots_SnapshotProfiles_ProfileId",
                table: "Snapshots");

            migrationBuilder.DropForeignKey(
                name: "FK_StashTabs_Snapshots_SnapshotId",
                table: "StashTabs");

            migrationBuilder.AlterColumn<int>(
                name: "SnapshotId",
                table: "StashTabs",
                type: "int",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<int>(
                name: "ProfileId",
                table: "Snapshots",
                type: "int",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<int>(
                name: "AccountId",
                table: "SnapshotProfiles",
                type: "int",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<int>(
                name: "StashtabId",
                table: "PricedItems",
                type: "int",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<int>(
                name: "AccountId",
                table: "Characters",
                type: "int",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_Characters_Accounts_AccountId",
                table: "Characters",
                column: "AccountId",
                principalTable: "Accounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PricedItems_StashTabs_StashtabId",
                table: "PricedItems",
                column: "StashtabId",
                principalTable: "StashTabs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SnapshotProfiles_Accounts_AccountId",
                table: "SnapshotProfiles",
                column: "AccountId",
                principalTable: "Accounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Snapshots_SnapshotProfiles_ProfileId",
                table: "Snapshots",
                column: "ProfileId",
                principalTable: "SnapshotProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StashTabs_Snapshots_SnapshotId",
                table: "StashTabs",
                column: "SnapshotId",
                principalTable: "Snapshots",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
