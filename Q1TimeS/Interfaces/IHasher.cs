namespace Q1TimeS.Interfaces
{
    public interface IHasher
    {
        public string HashPassword(string password);
        public bool Verify(string password, string hashed_password);
    }
}
