namespace Application.Core
{
    public class AppException
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public string Details { get; set; }

        public AppException(int status, string message, string detatils = null)
        {
            StatusCode = status;
            Message = message;
            Details = detatils;
        }
    }
}