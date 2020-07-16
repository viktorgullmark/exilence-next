using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Shared.Migrations
{
    public partial class SnapshotsToMongoDB : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PricedItems");

            migrationBuilder.DropTable(
                name: "StashTabs");

            migrationBuilder.DropTable(
                name: "Snapshots");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Snapshots",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClientId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ProfileId = table.Column<int>(type: "int", nullable: false)
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
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClientId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Color = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Index = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SnapshotId = table.Column<int>(type: "int", nullable: false),
                    StashTabId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Value = table.Column<decimal>(type: "decimal(13,4)", nullable: false)
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
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BaseType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Calculated = table.Column<decimal>(type: "decimal(13,4)", nullable: false),
                    ClientId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Corrupted = table.Column<bool>(type: "bit", nullable: false),
                    Count = table.Column<int>(type: "int", nullable: false),
                    Elder = table.Column<bool>(type: "bit", nullable: false),
                    FrameType = table.Column<int>(type: "int", nullable: false),
                    Icon = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Ilvl = table.Column<int>(type: "int", nullable: false),
                    ItemId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Level = table.Column<int>(type: "int", nullable: false),
                    Links = table.Column<int>(type: "int", nullable: false),
                    Max = table.Column<decimal>(type: "decimal(13,4)", nullable: false),
                    Mean = table.Column<decimal>(type: "decimal(13,4)", nullable: false),
                    Median = table.Column<decimal>(type: "decimal(13,4)", nullable: false),
                    Min = table.Column<decimal>(type: "decimal(13,4)", nullable: false),
                    Mode = table.Column<decimal>(type: "decimal(13,4)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Quality = table.Column<int>(type: "int", nullable: false),
                    Shaper = table.Column<bool>(type: "bit", nullable: false),
                    Sockets = table.Column<int>(type: "int", nullable: false),
                    StackSize = table.Column<int>(type: "int", nullable: false),
                    StashtabId = table.Column<int>(type: "int", nullable: false),
                    Tier = table.Column<int>(type: "int", nullable: false),
                    Total = table.Column<decimal>(type: "decimal(13,4)", nullable: false),
                    TotalStacksize = table.Column<int>(type: "int", nullable: false),
                    TypeLine = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Variant = table.Column<string>(type: "nvarchar(max)", nullable: true)
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
                name: "IX_PricedItems_ClientId",
                table: "PricedItems",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_PricedItems_StashtabId",
                table: "PricedItems",
                column: "StashtabId");

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
    }
}
