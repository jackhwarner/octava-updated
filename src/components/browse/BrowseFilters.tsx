
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';

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

const cities = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
  'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
  'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Indianapolis, IN',
  'Charlotte, NC', 'San Francisco, CA', 'Seattle, WA', 'Denver, CO', 'Oklahoma City, OK',
  'Nashville, TN', 'El Paso, TX', 'Washington, DC', 'Boston, MA', 'Las Vegas, NV',
  'Portland, OR', 'Detroit, MI', 'Louisville, KY', 'Memphis, TN', 'Baltimore, MD',
  'Milwaukee, WI', 'Albuquerque, NM', 'Fresno, CA', 'Tucson, AZ', 'Sacramento, CA',
  'Mesa, AZ', 'Kansas City, MO', 'Atlanta, GA', 'Omaha, NE', 'Colorado Springs, CO',
  'Raleigh, NC', 'Virginia Beach, VA', 'Miami, FL', 'Oakland, CA', 'Minneapolis, MN',
  'Tulsa, OK', 'Arlington, TX', 'New Orleans, LA', 'Wichita, KS', 'Cleveland, OH'
];

// Major city to zip codes mapping (simplified)
const cityToZipCodes: { [key: string]: string[] } = {
  'New York, NY': ['10001', '10002', '10003', '10004', '10005', '10006', '10007', '10008', '10009', '10010'],
  'Los Angeles, CA': ['90001', '90002', '90003', '90004', '90005', '90006', '90007', '90008', '90009', '90010'],
  'Chicago, IL': ['60601', '60602', '60603', '60604', '60605', '60606', '60607', '60608', '60609', '60610'],
  'Houston, TX': ['77001', '77002', '77003', '77004', '77005', '77006', '77007', '77008', '77009', '77010'],
  'Phoenix, AZ': ['85001', '85002', '85003', '85004', '85005', '85006', '85007', '85008', '85009', '85010'],
  'Philadelphia, PA': ['19101', '19102', '19103', '19104', '19105', '19106', '19107', '19108', '19109', '19110'],
  'San Antonio, TX': ['78201', '78202', '78203', '78204', '78205', '78206', '78207', '78208', '78209', '78210'],
  'San Diego, CA': ['92101', '92102', '92103', '92104', '92105', '92106', '92107', '92108', '92109', '92110'],
  'Dallas, TX': ['75201', '75202', '75203', '75204', '75205', '75206', '75207', '75208', '75209', '75210'],
  'San Jose, CA': ['95101', '95102', '95103', '95104', '95105', '95106', '95107', '95108', '95109', '95110'],
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
  const filteredCities = cities.filter(city => 
    city.toLowerCase().includes(location.toLowerCase())
  );

  const handleLocationSelect = (selectedCity: string) => {
    setLocation(selectedCity);
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

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vocalist">Vocalist</SelectItem>
                <SelectItem value="producer">Producer</SelectItem>
                <SelectItem value="instrumentalist">Instrumentalist</SelectItem>
                <SelectItem value="songwriter">Songwriter</SelectItem>
                <SelectItem value="composer">Composer</SelectItem>
                <SelectItem value="engineer">Engineer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger>
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pop">Pop</SelectItem>
                <SelectItem value="rock">Rock</SelectItem>
                <SelectItem value="hip-hop">Hip-Hop</SelectItem>
                <SelectItem value="r&b">R&B</SelectItem>
                <SelectItem value="country">Country</SelectItem>
                <SelectItem value="electronic">Electronic</SelectItem>
                <SelectItem value="jazz">Jazz</SelectItem>
                <SelectItem value="classical">Classical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={selectedInstrument} onValueChange={setSelectedInstrument}>
              <SelectTrigger>
                <SelectValue placeholder="Instrument" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="piano">Piano</SelectItem>
                <SelectItem value="guitar">Guitar</SelectItem>
                <SelectItem value="drums">Drums</SelectItem>
                <SelectItem value="bass">Bass</SelectItem>
                <SelectItem value="violin">Violin</SelectItem>
                <SelectItem value="vocals">Vocals</SelectItem>
                <SelectItem value="saxophone">Saxophone</SelectItem>
                <SelectItem value="trumpet">Trumpet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={selectedExperience} onValueChange={setSelectedExperience}>
              <SelectTrigger>
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <Input 
              placeholder="City, State or ZIP Code" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              className="w-full"
            />
            {location && filteredCities.length > 0 && !location.match(/^\d{5}$/) && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredCities.slice(0, 10).map((city) => (
                  <button
                    key={city}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100"
                    onClick={() => handleLocationSelect(city)}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <Button 
              onClick={handleSearch} 
              aria-label="Search" 
              className="bg-purple-600 hover:bg-purple-700 w-full"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrowseFilters;
