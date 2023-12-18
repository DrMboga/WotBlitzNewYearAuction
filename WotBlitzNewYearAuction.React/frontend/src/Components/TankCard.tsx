// @flow
import * as React from 'react';
import { Vehicle } from '../Model/Vehicle';
import './TankCard.css';
import { nationAsset, tankTypeAsset } from '../helpers';

export const PremiumColor = '#d4d481';
export const CollectibleColor = '#64c8f5';

type Props = {
  vehicle?: Vehicle;
};

export function TankCard({ vehicle }: Props) {
  const tankTier = (tier: string, isPremium: boolean, isCollectible: boolean) => {
    if (isPremium) {
      if (isCollectible) {
        return <b style={{ color: CollectibleColor, fontSize: '16px' }}>{tier}</b>;
      } else {
        return <b style={{ color: PremiumColor, fontSize: '16px' }}>{tier}</b>;
      }
    } else {
      return <b style={{ fontSize: '16px' }}>{tier}</b>;
    }
  };

  if (!vehicle) {
    return <></>;
  }
  return (
    <div className="tank-image">
      <div
        className="tank-flag-background"
        style={{ backgroundImage: `url(${nationAsset(vehicle.nation)}` }}
      ></div>
      <div className="tank-tier">
        {tankTier(vehicle.roman_level, vehicle.is_premium, vehicle.is_collectible)}
      </div>
      <img className="tank-preview" src={vehicle.preview_image_url} alt={vehicle.user_string} />
      <img
        className="tank-type"
        src={tankTypeAsset(vehicle.type_slug, vehicle.is_premium, vehicle.is_collectible)}
        alt={vehicle.type_slug}
      />
    </div>
  );
}
