using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.API.Data;
using TaskManager.API.DTOs;
using TaskManager.API.Models;
using TaskManager.API.Services;

namespace TaskManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly JwtService _jwt;
    private readonly IEmailService _email;
    private readonly IConfiguration _config;

    private const int ResetTokenValidityMinutes = 30;

    public AuthController(AppDbContext db, JwtService jwt, IEmailService email, IConfiguration config)
    {
        _db = db;
        _jwt = jwt;
        _email = email;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest req)
    {
        if (await _db.Users.AnyAsync(u => u.Email == req.Email))
            return Conflict(new { message = "Email already registered" });

        var user = new User
        {
            Name = req.Name,
            Email = req.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password)
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var token = _jwt.GenerateToken(user);
        return Ok(new AuthResponse(token, user.Name, user.Email));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest req)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);

        if (user is null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password" });

        var token = _jwt.GenerateToken(user);
        return Ok(new AuthResponse(token, user.Name, user.Email));
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest req)
    {
        // Always return the same generic response whether or not the email exists,
        // so this endpoint can't be used to discover which emails are registered.
        const string genericResponse = "If that email is registered, a reset link has been sent.";

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
        if (user is null)
            return Ok(new { message = genericResponse });

        // Generate a random raw token, email it to the user, but only store its hash.
        // This mirrors how we never store the plaintext password.
        var rawToken = GenerateRawToken();
        user.ResetTokenHash = HashToken(rawToken);
        user.ResetTokenExpiresAt = DateTime.UtcNow.AddMinutes(ResetTokenValidityMinutes);
        await _db.SaveChangesAsync();

        var frontendUrl = _config["Frontend:Url"] ?? "http://localhost:5173";
        var resetLink = $"{frontendUrl}/reset-password?token={rawToken}";
        await _email.SendPasswordResetEmailAsync(user.Email, user.Name, resetLink);

        return Ok(new { message = genericResponse });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.NewPassword) || req.NewPassword.Length < 6)
            return BadRequest(new { message = "Password must be at least 6 characters." });

        var tokenHash = HashToken(req.Token);
        var user = await _db.Users.FirstOrDefaultAsync(u => u.ResetTokenHash == tokenHash);

        if (user is null || user.ResetTokenExpiresAt is null || user.ResetTokenExpiresAt < DateTime.UtcNow)
            return BadRequest(new { message = "This reset link is invalid or has expired." });

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
        user.ResetTokenHash = null;
        user.ResetTokenExpiresAt = null;
        await _db.SaveChangesAsync();

        return Ok(new { message = "Your password has been reset. You can now log in." });
    }

    private static string GenerateRawToken() =>
        Convert.ToHexString(RandomNumberGenerator.GetBytes(32));

    private static string HashToken(string rawToken) =>
        Convert.ToHexString(SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(rawToken)));
}
