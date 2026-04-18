export class StatisticBlockData {
  constructor({ title, value, badgeText, badgeType, bgColor, textColor, iconName, iconColor, hasBgIcon = false }) {
    this.title = title;
    this.value = value;
    this.badgeText = badgeText;
    this.badgeType = badgeType; // e.g., 'action', 'urgent', 'positive', 'none'
    this.bgColor = bgColor;
    this.textColor = textColor;
    this.iconName = iconName; 
    this.iconColor = iconColor;
    this.hasBgIcon = hasBgIcon;
  }
}
