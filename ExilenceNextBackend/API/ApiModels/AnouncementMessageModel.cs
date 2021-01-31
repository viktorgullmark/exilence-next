using MessagePack;

namespace API.ApiModels
{
    [MessagePackObject]
    public class AnouncementMessageModel
    {
        [Key("title")]
        public string Title { get; set; }
        [Key("message")]
        public string Message { get; set; }
    }
}
