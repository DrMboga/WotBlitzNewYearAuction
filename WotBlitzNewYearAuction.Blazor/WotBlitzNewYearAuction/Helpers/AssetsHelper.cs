namespace WotBlitzNewYearAuction;

public static class AssetsHelper
{
    public static string NationAsset(this string nationTypeId)
    {
        return nationTypeId switch
        {
            "usa" => "Assets/flags/usa-faded.png",
            "france" => "Assets/flags/france-faded.png",
            "ussr" => "Assets/flags/ussr-faded.png",
            "china" => "Assets/flags/china-faded.png",
            "uk" => "Assets/flags/uk-faded.png",
            "japan" => "Assets/flags/japan-faded.png",
            "germany" => "Assets/flags/germany-faded.png",
            "other" => "Assets/flags/other-faded.png",
            "european" => "Assets/flags/eu-faded.png",
            _ => "flags/vehicle.nation.unknown.scale-200-faded.png"
        };
    }

    public static string TankTypeAsset(this string tankTypeId, bool isPremium, bool isCollectible)
    {
        return tankTypeId switch
        {
            "heavyTank" when !isPremium => "Assets/tank-type/heavy.svg",
            "heavyTank" when isPremium && !isCollectible => "Assets/tank-type/heavy.premium.svg",
            "heavyTank" when isPremium && isCollectible => "Assets/tank-type/heavy.collectible.svg",
            "AT-SPG" when !isPremium => "Assets/tank-type/at.svg",
            "AT-SPG" when isPremium && !isCollectible => "Assets/tank-type/at.premium.svg",
            "AT-SPG" when isPremium && isCollectible => "Assets/tank-type/at.collectible.svg",
            "mediumTank" when !isPremium => "Assets/tank-type/medium.svg",
            "mediumTank" when isPremium && !isCollectible => "Assets/tank-type/medium.premium.svg",
            "mediumTank" when isPremium && isCollectible => "Assets/tank-type/medium.collectible.svg",
            "lightTank" when !isPremium => "Assets/tank-type/light.svg",
            "lightTank" when isPremium && !isCollectible => "Assets/tank-type/light.premium.svg",
            "lightTank" when isPremium && isCollectible => "Assets/tank-type/lite.collectible.svg",
            _ => ""
        };
    }
}
