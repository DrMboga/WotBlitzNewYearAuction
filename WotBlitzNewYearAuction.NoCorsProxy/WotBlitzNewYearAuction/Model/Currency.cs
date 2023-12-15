namespace WotBlitzNewYearAuction;

public class Currency
{
    
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;
    [JsonPropertyName("image_url")]
    public string ImageUrl { get; set; } = string.Empty;
}
