using Microsoft.EntityFrameworkCore.Migrations;

namespace Shared.Migrations
{
    public partial class ClientIdIndex : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_StashTabs_ClientId",
                table: "StashTabs",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_Snapshots_ClientId",
                table: "Snapshots",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_SnapshotProfiles_ClientId",
                table: "SnapshotProfiles",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_PricedItems_ClientId",
                table: "PricedItems",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_Leagues_ClientId",
                table: "Leagues",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_Groups_ClientId",
                table: "Groups",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_Connections_ConnectionId",
                table: "Connections",
                column: "ConnectionId");

            migrationBuilder.CreateIndex(
                name: "IX_Characters_ClientId",
                table: "Characters",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_ClientId",
                table: "Accounts",
                column: "ClientId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_StashTabs_ClientId",
                table: "StashTabs");

            migrationBuilder.DropIndex(
                name: "IX_Snapshots_ClientId",
                table: "Snapshots");

            migrationBuilder.DropIndex(
                name: "IX_SnapshotProfiles_ClientId",
                table: "SnapshotProfiles");

            migrationBuilder.DropIndex(
                name: "IX_PricedItems_ClientId",
                table: "PricedItems");

            migrationBuilder.DropIndex(
                name: "IX_Leagues_ClientId",
                table: "Leagues");

            migrationBuilder.DropIndex(
                name: "IX_Groups_ClientId",
                table: "Groups");

            migrationBuilder.DropIndex(
                name: "IX_Connections_ConnectionId",
                table: "Connections");

            migrationBuilder.DropIndex(
                name: "IX_Characters_ClientId",
                table: "Characters");

            migrationBuilder.DropIndex(
                name: "IX_Accounts_ClientId",
                table: "Accounts");
        }
    }
}
