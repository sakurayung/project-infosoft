using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace project_infosoft.Migrations
{
    /// <inheritdoc />
    public partial class AddedQuantity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Format",
                table: "Video",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "Video",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "BorrowedDate",
                table: "Rental",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "Rental",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Format",
                table: "Video");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "Video");

            migrationBuilder.DropColumn(
                name: "BorrowedDate",
                table: "Rental");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "Rental");
        }
    }
}
