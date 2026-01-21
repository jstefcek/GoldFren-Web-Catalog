export const countryFlags = {
  // --- A ---
  'Afghanistan': '🇦🇫',
  'Albania': '🇦🇱',
  'Algeria': '🇩🇿',
  'Andorra': '🇦🇩',
  'Angola': '🇦🇴',
  'Argentina': '🇦🇷',
  'Armenia': '🇦🇲',
  'Australia': '🇦🇺',
  'Austria': '🇦🇹',
  'Azerbaijan': '🇦🇿',
  'Arabic': '🇸🇦',

  // --- B ---
  'Bahamas': '🇧🇸',
  'Bahrain': '🇧🇭',
  'Bangladesh': '🇧🇩',
  'Belarus': '🇧🇾',
  'Belgium': '🇧🇪',
  'Bolivia': '🇧🇴',
  'Bosnia and Herzegovina': '🇧🇦',
  'Brazil': '🇧🇷',
  'Bulgaria': '🇧🇬',

  // --- C ---
  'Cambodia': '🇰🇭',
  'Canada': '🇨🇦',
  'Chile': '🇨🇱',
  'China': '🇨🇳',
  'Chinese': '🇨🇳',
  'Colombia': '🇨🇴',
  'Croatia': '🇭🇷',
  'Cuba': '🇨🇺',
  'Cyprus': '🇨🇾',
  'Czechia': '🇨🇿',
  'Czech Republic': '🇨🇿',
  'Czech': '🇨🇿',

  // --- D ---
  'Denmark': '🇩🇰',

  // --- E ---
  'Ecuador': '🇪🇨',
  'Egypt': '🇪🇬',
  'Estonia': '🇪🇪',

  // --- F ---
  'Finland': '🇫🇮',
  'France': '🇫🇷',
  'French': '🇫🇷',

  // --- G ---
  'Georgia': '🇬🇪',
  'Germany': '🇩🇪',
  'German': '🇩🇪',
  'Greece': '🇬🇷',

  // --- H ---
  'Hungary': '🇭🇺',

  // --- I ---
  'Iceland': '🇮🇸',
  'India': '🇮🇳',
  'Indonesia': '🇮🇩',
  'Iran': '🇮🇷',
  'Iraq': '🇮🇶',
  'Ireland': '🇮🇪',
  'Israel': '🇮🇱',
  'Italy': '🇮🇹',
  'Italian': '🇮🇹',

  // --- J ---
  'Japan': '🇯🇵',
  'Japanese': '🇯🇵',

  // --- K ---
  'Kazakhstan': '🇰🇿',
  'Korea': '🇰🇷',
  'South Korea': '🇰🇷',
  'Korean': '🇰🇷',

  // --- L ---
  'Latvia': '🇱🇻',
  'Latvian': '🇱🇻',
  'Lithuania': '🇱🇹',
  'Lithuanian': '🇱🇹',
  'Luxembourg': '🇱🇺',

  // --- M ---
  'Malaysia': '🇲🇾',
  'Mexico': '🇲🇽',
  'Moldova': '🇲🇩',
  'Monaco': '🇲🇨',
  'Montenegro': '🇲🇪',
  'Morocco': '🇲🇦',

  // --- N ---
  'Netherlands': '🇳🇱',
  'Holland': '🇳🇱',
  'Dutch': '🇳🇱',
  'New Zealand': '🇳🇿',
  'Norway': '🇳🇴',

  // --- P ---
  'Pakistan': '🇵🇰',
  'Peru': '🇵🇪',
  'Philippines': '🇵🇭',
  'Poland': '🇵🇱',
  'Polish': '🇵🇱',
  'Portugal': '🇵🇹',
  'Portuguese': '🇵🇹',

  // --- R ---
  'Romania': '🇷🇴',
  'Russia': '🇷🇺',
  'Russian': '🇷🇺',

  // --- S ---
  'Saudi Arabia': '🇸🇦',
  'Serbia': '🇷🇸',
  'Singapore': '🇸🇬',
  'Slovakia': '🇸🇰',
  'Slovenia': '🇸🇮',
  'South Africa': '🇿🇦',
  'Spain': '🇪🇸',
  'Spanish': '🇪🇸',
  'Sweden': '🇸🇪',
  'Swedish': '🇸🇪',
  'Switzerland': '🇨🇭',

  // --- T ---
  'Thailand': '🇹🇭',
  'Turkey': '🇹🇷',
  'Turkish': '🇹🇷',

  // --- U ---
  'Ukraine': '🇺🇦',
  'United Kingdom': '🇬🇧',
  'Great Britain': '🇬🇧',
  'UK': '🇬🇧',
  'England': '🇬🇧',
  'English': '🇬🇧',

  'United States': '🇺🇸',
  'USA': '🇺🇸',
  'US': '🇺🇸',
  'American': '🇺🇸',

  // --- V ---
  'Vietnam': '🇻🇳',
  'Vietnamese': '🇻🇳',

  // --- Z ---
  'Zimbabwe': '🇿🇼',
};

// Function to get country flag by country name
export const getCountryFlag = (countryName) => {
  return countryFlags[countryName] || '🌐';
};