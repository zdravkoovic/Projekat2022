using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Server.Migrations
{
    public partial class V1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Inzenjeri",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ime = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Licenca = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Inzenjeri", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Materijali",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Klasa = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: true),
                    Cena = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Materijali", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Projekti",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    Adresa = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    DatumPocetka = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projekti", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Masine",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Potrosnja = table.Column<int>(type: "int", nullable: false),
                    CenaGoriva = table.Column<int>(type: "int", nullable: false),
                    ProjekatID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Masine", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Masine_Projekti_ProjekatID",
                        column: x => x.ProjekatID,
                        principalTable: "Projekti",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProjekatInzenjer",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Dnevnica = table.Column<int>(type: "int", nullable: false),
                    InzenjerID = table.Column<int>(type: "int", nullable: true),
                    ProjekatID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjekatInzenjer", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProjekatInzenjer_Inzenjeri_InzenjerID",
                        column: x => x.InzenjerID,
                        principalTable: "Inzenjeri",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProjekatInzenjer_Projekti_ProjekatID",
                        column: x => x.ProjekatID,
                        principalTable: "Projekti",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProjekatMaterijali",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Kolicina = table.Column<int>(type: "int", nullable: false),
                    ProjekatID = table.Column<int>(type: "int", nullable: true),
                    MaterijalID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjekatMaterijali", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProjekatMaterijali_Materijali_MaterijalID",
                        column: x => x.MaterijalID,
                        principalTable: "Materijali",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProjekatMaterijali_Projekti_ProjekatID",
                        column: x => x.ProjekatID,
                        principalTable: "Projekti",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Radnici",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ime = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    Iskustvo = table.Column<int>(type: "int", nullable: false),
                    Dnevnica = table.Column<int>(type: "int", nullable: false),
                    ProjekatID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Radnici", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Radnici_Projekti_ProjekatID",
                        column: x => x.ProjekatID,
                        principalTable: "Projekti",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Masine_ProjekatID",
                table: "Masine",
                column: "ProjekatID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjekatInzenjer_InzenjerID",
                table: "ProjekatInzenjer",
                column: "InzenjerID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjekatInzenjer_ProjekatID",
                table: "ProjekatInzenjer",
                column: "ProjekatID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjekatMaterijali_MaterijalID",
                table: "ProjekatMaterijali",
                column: "MaterijalID");

            migrationBuilder.CreateIndex(
                name: "IX_ProjekatMaterijali_ProjekatID",
                table: "ProjekatMaterijali",
                column: "ProjekatID");

            migrationBuilder.CreateIndex(
                name: "IX_Radnici_ProjekatID",
                table: "Radnici",
                column: "ProjekatID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Masine");

            migrationBuilder.DropTable(
                name: "ProjekatInzenjer");

            migrationBuilder.DropTable(
                name: "ProjekatMaterijali");

            migrationBuilder.DropTable(
                name: "Radnici");

            migrationBuilder.DropTable(
                name: "Inzenjeri");

            migrationBuilder.DropTable(
                name: "Materijali");

            migrationBuilder.DropTable(
                name: "Projekti");
        }
    }
}
