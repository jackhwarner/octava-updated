import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, X } from 'lucide-react';
import roles from '@/constants/roles';
import genres from '@/constants/genres';
import instruments from '@/constants/instruments';
interface BrowseFiltersProps {
  selectedRole: string;
  setSelectedRole: (value: string) => void;
  selectedGenre: string;
  setSelectedGenre: (value: string) => void;
  selectedInstrument: string;
  setSelectedInstrument: (value: string) => void;
  selectedExperience: string;
  setSelectedExperience: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  onSearch: () => void;
}
const cities = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Indianapolis, IN', 'Charlotte, NC', 'San Francisco, CA', 'Seattle, WA', 'Denver, CO', 'Oklahoma City, OK', 'Nashville, TN', 'El Paso, TX', 'Washington, DC', 'Boston, MA', 'Las Vegas, NV', 'Portland, OR', 'Detroit, MI', 'Louisville, KY', 'Memphis, TN', 'Baltimore, MD', 'Milwaukee, WI', 'Albuquerque, NM', 'Fresno, CA', 'Tucson, AZ', 'Sacramento, CA', 'Mesa, AZ', 'Kansas City, MO', 'Atlanta, GA', 'Omaha, NE', 'Colorado Springs, CO', 'Raleigh, NC', 'Virginia Beach, VA', 'Miami, FL', 'Oakland, CA', 'Minneapolis, MN', 'Tulsa, OK', 'Arlington, TX', 'New Orleans, LA', 'Wichita, KS', 'Cleveland, OH'];

// Major city to zip codes mapping (simplified)
const cityToZipCodes: {
  [key: string]: string[];
} = {
  'New York, NY': ['10001', '10002', '10003', '10004', '10005', '10006', '10007', '10008', '10009', '10010'],
  'Los Angeles, CA': ['90001', '90002', '90003', '90004', '90005', '90006', '90007', '90008', '90009', '90010'],
  'Chicago, IL': ['60601', '60602', '60603', '60604', '60605', '60606', '60607', '60608', '60609', '60610'],
  'Houston, TX': ['77001', '77002', '77003', '77004', '77005', '77006', '77007', '77008', '77009', '77010'],
  'Phoenix, AZ': ['85001', '85002', '85003', '85004', '85005', '85006', '85007', '85008', '85009', '85010'],
  'Philadelphia, PA': ['19101', '19102', '19103', '19104', '19105', '19106', '19107', '19108', '19109', '19110'],
  'San Antonio, TX': ['78201', '78202', '78203', '78204', '78205', '78206', '78207', '78208', '78209', '78210'],
  'San Diego, CA': ['92101', '92102', '92103', '92104', '92105', '92106', '92107', '92108', '92109', '92110']
  // Add more cities as needed
};
const BrowseFilters = ({
  selectedRole,
  setSelectedRole,
  selectedGenre,
  setSelectedGenre,
  selectedInstrument,
  setSelectedInstrument,
  selectedExperience,
  setSelectedExperience,
  location,
  setLocation,
  onSearch
}: BrowseFiltersProps) => {
  // manage input focus state
  const [locationFocused, setLocationFocused] = useState(false);
  const filteredCities = cities.filter(city => city.toLowerCase().includes(location.toLowerCase()));
  const handleLocationSelect = (selectedCity: string) => {
    setLocation(selectedCity);
    setLocationFocused(false);
  };
  const handleSearch = () => {
    // Check if location is a zip code (5 digits)
    const isZipCode = /^\d{5}$/.test(location);
    if (isZipCode) {
      // Search by zip code directly
      console.log('Searching by zip code:', location);
      onSearch();
    } else {
      // Check if it's a city and convert to zip codes
      const zipCodes = cityToZipCodes[location];
      if (zipCodes) {
        console.log('Searching by city zip codes:', zipCodes);
        // You could modify the search function to accept multiple zip codes
        // For now, we'll just use the first zip code or pass the city name
        onSearch();
      } else {
        // Regular search with location string
        console.log('Searching by location string:', location);
        onSearch();
      }
    }
  };

  // Unified handler for Selects to allow 'clear'
  const handleSelectClearable = (value: string, setter: (v: string) => void) => {
    if (value === 'none') {
      setter('');
    } else {
      setter(value);
    }
  };
  return <Card className="mb-8">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Role Filter */}
          <div className="flex items-center relative">
            <Select value={selectedRole || ""} onValueChange={v => handleSelectClearable(v, setSelectedRole)}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" key="_role_clear" className="text-gray-400">
                  Clear
                </SelectItem>
                {roles.map(role => <SelectItem key={role.toLowerCase()} value={role.toLowerCase()}>
                    {role}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Genre Filter */}
          <div className="flex items-center relative">
            <Select value={selectedGenre || ""} onValueChange={v => handleSelectClearable(v, setSelectedGenre)}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" key="_genre_clear" className="text-gray-400">
                  Clear
                </SelectItem>
                {genres.map(genre => <SelectItem key={genre.toLowerCase()} value={genre.toLowerCase()}>
                    {genre}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Instrument Filter */}
          <div className="flex items-center relative">
            <Select value={selectedInstrument || ""} onValueChange={v => handleSelectClearable(v, setSelectedInstrument)}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Instrument" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" key="_instrument_clear" className="text-gray-400">
                  Clear
                </SelectItem>
                {instruments.map(instrument => <SelectItem key={instrument.toLowerCase()} value={instrument.toLowerCase()}>
                    {instrument}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Experience Filter */}
          <div className="flex items-center relative">
            <Select value={selectedExperience || ""} onValueChange={v => handleSelectClearable(v, setSelectedExperience)}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" key="_experience_clear" className="text-gray-400">
                  Clear
                </SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location Filter */}
          <div className="relative flex items-center">
            <div className="w-full relative">
              <Input
                placeholder="City or ZIP Code"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full flex-1"
                onFocus={() => setLocationFocused(true)}
                onBlur={() => setTimeout(() => setLocationFocused(false), 100)}
                style={{ minWidth: 0 }}
              />
              {location && filteredCities.length > 0 && !location.match(/^\d{5}$/) && locationFocused && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto" style={{ top: '100%', left: 0 }}>
                  {filteredCities.slice(0, 10).map(city => (
                    <button
                      key={city}
                      type="button"
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100"
                      onMouseDown={() => handleLocationSelect(city)}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
              {/* Helper text if previously added */}
              <span className="text-xs text-gray-400 mt-1 block">
                {/* Remove if redundant since placeholder is now clear */}
              </span>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-center">
            <Button onClick={handleSearch} aria-label="Search" className="bg-purple-600 hover:bg-purple-700 w-full">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default BrowseFilters;
