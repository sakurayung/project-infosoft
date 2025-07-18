using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace project_infosoft.Migrations
{
    /// <inheritdoc />
    public partial class AddPriceAndReturnedDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "Rental",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<DateTime>(
                name: "ReturnedDate",
                table: "Rental",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_Rental_CustomerId",
                table: "Rental",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Rental_VideoId",
                table: "Rental",
                column: "VideoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Rental_Customer_CustomerId",
                table: "Rental",
                column: "CustomerId",
                principalTable: "Customer",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Rental_Video_VideoId",
                table: "Rental",
                column: "VideoId",
                principalTable: "Video",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rental_Customer_CustomerId",
                table: "Rental");

            migrationBuilder.DropForeignKey(
                name: "FK_Rental_Video_VideoId",
                table: "Rental");

            migrationBuilder.DropIndex(
                name: "IX_Rental_CustomerId",
                table: "Rental");

            migrationBuilder.DropIndex(
                name: "IX_Rental_VideoId",
                table: "Rental");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "Rental");

            migrationBuilder.DropColumn(
                name: "ReturnedDate",
                table: "Rental");
        }
    }
}
