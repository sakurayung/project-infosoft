using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace project_infosoft.Migrations
{
    /// <inheritdoc />
    public partial class Genesis : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Format",
                table: "Video");

            migrationBuilder.AddColumn<decimal>(
                name: "DuePrice",
                table: "Rental",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "isReturned",
                table: "Rental",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DuePrice",
                table: "Rental");

            migrationBuilder.DropColumn(
                name: "isReturned",
                table: "Rental");

            migrationBuilder.AddColumn<string>(
                name: "Format",
                table: "Video",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
