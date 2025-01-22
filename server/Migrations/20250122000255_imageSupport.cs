using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class imageSupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageContent",
                table: "PrivateMessages");

            migrationBuilder.DropColumn(
                name: "ImageContent",
                table: "GroupMessages");

            migrationBuilder.AddColumn<string>(
                name: "ImagePath",
                table: "PrivateMessages",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImagePath",
                table: "GroupMessages",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImagePath",
                table: "PrivateMessages");

            migrationBuilder.DropColumn(
                name: "ImagePath",
                table: "GroupMessages");

            migrationBuilder.AddColumn<byte[]>(
                name: "ImageContent",
                table: "PrivateMessages",
                type: "varbinary(max)",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "ImageContent",
                table: "GroupMessages",
                type: "varbinary(max)",
                nullable: true);
        }
    }
}
