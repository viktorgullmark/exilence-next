using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Shared.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Accounts",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClientId = table.Column<string>(maxLength: 50, nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Verified = table.Column<bool>(nullable: false),
                    Role = table.Column<int>(nullable: false),
                    Datestamp = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Accounts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Groups",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClientId = table.Column<string>(maxLength: 50, nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Hash = table.Column<string>(nullable: false),
                    Salt = table.Column<string>(nullable: false),
                    Created = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Groups", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Leagues",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClientId = table.Column<int>(nullable: false),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Leagues", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SnapshotProfiles",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClientId = table.Column<string>(maxLength: 50, nullable: false),
                    Name = table.Column<string>(nullable: true),
                    ActiveLeagueId = table.Column<string>(nullable: true),
                    ActivePriceLeagueId = table.Column<string>(nullable: true),
                    Active = table.Column<bool>(nullable: false),
                    ActiveStashTabIds = table.Column<string>(nullable: true),
                    AccountId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SnapshotProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SnapshotProfiles_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Connections",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ConnectionId = table.Column<string>(maxLength: 100, nullable: false),
                    InstanceName = table.Column<string>(maxLength: 20, nullable: false),
                    Datestamp = table.Column<DateTime>(maxLength: 20, nullable: false),
                    AccountId = table.Column<int>(nullable: true),
                    GroupId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Connections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Connections_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Connections_Groups_GroupId",
                        column: x => x.GroupId,
                        principalTable: "Groups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Characters",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClientId = table.Column<string>(maxLength: 50, nullable: false),
                    Name = table.Column<string>(nullable: true),
                    LeagueId = table.Column<int>(nullable: true),
                    Class = table.Column<int>(nullable: false),
                    Ascendancy = table.Column<int>(nullable: false),
                    Level = table.Column<int>(nullable: false),
                    AccountId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Characters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Characters_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Characters_Leagues_LeagueId",
                        column: x => x.LeagueId,
                        principalTable: "Leagues",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Snapshots",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClientId = table.Column<string>(maxLength: 50, nullable: false),
                    Datestamp = table.Column<DateTime>(nullable: false),
                    ProfileId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Snapshots", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Snapshots_SnapshotProfiles_ProfileId",
                        column: x => x.ProfileId,
                        principalTable: "SnapshotProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StashTabs",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClientId = table.Column<string>(maxLength: 50, nullable: false),
                    StashTabId = table.Column<string>(maxLength: 100, nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Index = table.Column<int>(nullable: false),
                    Color = table.Column<string>(nullable: true),
                    Value = table.Column<decimal>(type: "decimal(13,4)", nullable: false),
                    SnapshotId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StashTabs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StashTabs_Snapshots_SnapshotId",
                        column: x => x.SnapshotId,
                        principalTable: "Snapshots",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PricedItems",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClientId = table.Column<string>(maxLength: 100, nullable: false),
                    ItemId = table.Column<string>(maxLength: 100, nullable: false),
                    Name = table.Column<string>(nullable: true),
                    TypeLine = table.Column<string>(nullable: true),
                    FrameType = table.Column<int>(nullable: false),
                    Calculated = table.Column<decimal>(type: "decimal(13,4)", nullable: false),
                    Elder = table.Column<bool>(nullable: false),
                    Shaper = table.Column<bool>(nullable: false),
                    Icon = table.Column<string>(nullable: true),
                    Ilvl = table.Column<int>(nullable: false),
                    Tier = table.Column<int>(nullable: false),
                    Corrupted = table.Column<bool>(nullable: false),
                    Links = table.Column<int>(nullable: false),
                    Sockets = table.Column<int>(nullable: false),
                    Quality = table.Column<int>(nullable: false),
                    Level = table.Column<int>(nullable: false),
                    StackSize = table.Column<int>(nullable: false),
                    TotalStacksize = table.Column<int>(nullable: false),
                    Variant = table.Column<string>(nullable: true),
                    Total = table.Column<decimal>(type: "decimal(13,4)", nullable: false),
                    Max = table.Column<decimal>(type: "decimal(13,4)", nullable: false),
                    Mean = table.Column<decimal>(type: "decimal(13,4)", nullable: false),
                    Mode = table.Column<decimal>(type: "decimal(13,4)", nullable: false),
                    Min = table.Column<decimal>(type: "decimal(13,4)", nullable: false),
                    Median = table.Column<decimal>(type: "decimal(13,4)", nullable: false),
                    BaseType = table.Column<string>(nullable: true),
                    Count = table.Column<int>(nullable: false),
                    StashtabId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PricedItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PricedItems_StashTabs_StashtabId",
                        column: x => x.StashtabId,
                        principalTable: "StashTabs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_ClientId",
                table: "Accounts",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_Characters_AccountId",
                table: "Characters",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_Characters_ClientId",
                table: "Characters",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_Characters_LeagueId",
                table: "Characters",
                column: "LeagueId");

            migrationBuilder.CreateIndex(
                name: "IX_Connections_AccountId",
                table: "Connections",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_Connections_ConnectionId",
                table: "Connections",
                column: "ConnectionId");

            migrationBuilder.CreateIndex(
                name: "IX_Connections_GroupId",
                table: "Connections",
                column: "GroupId");

            migrationBuilder.CreateIndex(
                name: "IX_Groups_ClientId",
                table: "Groups",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_Leagues_ClientId",
                table: "Leagues",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_PricedItems_ClientId",
                table: "PricedItems",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_PricedItems_StashtabId",
                table: "PricedItems",
                column: "StashtabId");

            migrationBuilder.CreateIndex(
                name: "IX_SnapshotProfiles_AccountId",
                table: "SnapshotProfiles",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_SnapshotProfiles_ClientId",
                table: "SnapshotProfiles",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_Snapshots_ClientId",
                table: "Snapshots",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_Snapshots_ProfileId",
                table: "Snapshots",
                column: "ProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_StashTabs_ClientId",
                table: "StashTabs",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_StashTabs_SnapshotId",
                table: "StashTabs",
                column: "SnapshotId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Characters");

            migrationBuilder.DropTable(
                name: "Connections");

            migrationBuilder.DropTable(
                name: "PricedItems");

            migrationBuilder.DropTable(
                name: "Leagues");

            migrationBuilder.DropTable(
                name: "Groups");

            migrationBuilder.DropTable(
                name: "StashTabs");

            migrationBuilder.DropTable(
                name: "Snapshots");

            migrationBuilder.DropTable(
                name: "SnapshotProfiles");

            migrationBuilder.DropTable(
                name: "Accounts");
        }
    }
}
