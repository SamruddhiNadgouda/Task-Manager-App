namespace TaskManager.API.Services;

/// <summary>
/// Development-time implementation of IEmailService: it just logs the reset link
/// instead of sending a real email, so you can test the flow without an SMTP
/// provider. Swap this out for a real implementation (e.g. using MailKit + SMTP,
/// or SendGrid/SES) before deploying to production — just implement IEmailService
/// and register it in Program.cs instead of this class.
/// </summary>
public class ConsoleEmailService : IEmailService
{
    private readonly ILogger<ConsoleEmailService> _logger;

    public ConsoleEmailService(ILogger<ConsoleEmailService> logger)
    {
        _logger = logger;
    }

    public Task SendPasswordResetEmailAsync(string toEmail, string toName, string resetLink)
    {
        var emailPreview =
            "\n----- PASSWORD RESET EMAIL (dev mode, not actually sent) -----\n" +
            $"To: {toName} <{toEmail}>\n" +
            "Subject: Reset your Task Manager password\n" +
            "\n" +
            $"Hi {toName},\n" +
            "We received a request to reset your password. Click the link below to choose a new one:\n" +
            $"{resetLink}\n" +
            "\n" +
            "This link expires in 30 minutes. If you didn't request this, you can ignore this email.\n" +
            "---------------------------------------------------------------";

        _logger.LogInformation("{EmailPreview}", emailPreview);

        return Task.CompletedTask;
    }
}
