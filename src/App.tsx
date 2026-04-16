import { useState } from 'react'
import { Search, Plus, MapPin, Calendar, Phone, X, Cat, Heart, AlertTriangle, Filter } from 'lucide-react'
import './App.css'

interface CatAnnouncement {
  id: number
  name: string
  description: string
  location: string
  date: string
  contact: string
  image: string
  status: 'lost' | 'found' | 'reunited'
  color: string
  breed: string
}

const initialAnnouncements: CatAnnouncement[] = [
  {
    id: 1,
    name: 'Whiskers',
    description: 'Friendly orange tabby cat, very playful. Has a small notch on the left ear. Responds to name and treats.',
    location: 'Downtown Park, Main Street',
    date: '2026-04-14',
    contact: '+1 (555) 123-4567',
    image: 'https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?w=400&h=300&fit=crop',
    status: 'lost',
    color: 'Orange',
    breed: 'Tabby',
  },
  {
    id: 2,
    name: 'Shadow',
    description: 'All black cat with bright green eyes. Very shy around strangers. Indoor cat that escaped through a window.',
    location: 'Elm Street, near the library',
    date: '2026-04-12',
    contact: '+1 (555) 234-5678',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
    status: 'lost',
    color: 'Black',
    breed: 'Domestic Shorthair',
  },
  {
    id: 3,
    name: 'Luna',
    description: 'White and gray fluffy cat with blue eyes. Wearing a pink collar with a bell. Very friendly and loves people.',
    location: 'Oak Avenue, Riverside',
    date: '2026-04-10',
    contact: '+1 (555) 345-6789',
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=300&fit=crop',
    status: 'found',
    color: 'White and Gray',
    breed: 'Persian Mix',
  },
  {
    id: 4,
    name: 'Mittens',
    description: 'Calico cat with distinctive white paws. Last seen near the fish market. Friendly with other cats.',
    location: 'Harbor District',
    date: '2026-04-08',
    contact: '+1 (555) 456-7890',
    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400&h=300&fit=crop',
    status: 'reunited',
    color: 'Calico',
    breed: 'Domestic Longhair',
  },
  {
    id: 5,
    name: 'Simba',
    description: 'Large ginger cat, neutered male. Missing from backyard. Has a microchip. Very vocal and demanding.',
    location: 'Maple Drive, Westside',
    date: '2026-04-15',
    contact: '+1 (555) 567-8901',
    image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=400&h=300&fit=crop',
    status: 'lost',
    color: 'Ginger',
    breed: 'Maine Coon Mix',
  },
  {
    id: 6,
    name: 'Unknown',
    description: 'Found this sweet gray kitten hiding under a car. No collar or tags. Appears to be about 6 months old.',
    location: 'Pine Street, near school',
    date: '2026-04-13',
    contact: '+1 (555) 678-9012',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop',
    status: 'found',
    color: 'Gray',
    breed: 'Unknown',
  },
]

function App() {
  const [announcements, setAnnouncements] = useState<CatAnnouncement[]>(initialAnnouncements)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'lost' | 'found' | 'reunited'>('all')
  const [showForm, setShowForm] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<CatAnnouncement | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    date: '',
    contact: '',
    image: '',
    status: 'lost' as 'lost' | 'found',
    color: '',
    breed: '',
  })

  const filteredAnnouncements = announcements.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.breed.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || a.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newAnnouncement: CatAnnouncement = {
      id: Date.now(),
      ...formData,
      image: formData.image || 'https://placehold.co/400x300/f3f4f6/9ca3af?text=No+Photo',
    }
    setAnnouncements([newAnnouncement, ...announcements])
    setFormData({
      name: '',
      description: '',
      location: '',
      date: '',
      contact: '',
      image: '',
      status: 'lost',
      color: '',
      breed: '',
    })
    setShowForm(false)
  }

  const statusColors = {
    lost: 'bg-red-100 text-red-800 border-red-200',
    found: 'bg-blue-100 text-blue-800 border-blue-200',
    reunited: 'bg-green-100 text-green-800 border-green-200',
  }

  const statusIcons = {
    lost: <AlertTriangle className="w-4 h-4" />,
    found: <Search className="w-4 h-4" />,
    reunited: <Heart className="w-4 h-4" />,
  }

  const counts = {
    all: announcements.length,
    lost: announcements.filter((a) => a.status === 'lost').length,
    found: announcements.filter((a) => a.status === 'found').length,
    reunited: announcements.filter((a) => a.status === 'reunited').length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <Cat className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                Lost Cats Finder
              </h1>
              <p className="mt-2 text-lg sm:text-xl text-orange-100 max-w-2xl">
                Help reunite lost cats with their families. Post announcements, search for missing cats, and bring them home.
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 text-center">
              <div className="text-2xl font-bold">{counts.lost}</div>
              <div className="text-xs text-orange-100 uppercase tracking-wide">Lost</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 text-center">
              <div className="text-2xl font-bold">{counts.found}</div>
              <div className="text-xs text-orange-100 uppercase tracking-wide">Found</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 text-center">
              <div className="text-2xl font-bold">{counts.reunited}</div>
              <div className="text-xs text-orange-100 uppercase tracking-wide">Reunited</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, location, color, breed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-700 placeholder-gray-400"
            />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Post Announcement
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
          {(['all', 'lost', 'found', 'reunited'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                filterStatus === status
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({counts[status]})
            </button>
          ))}
        </div>

        {/* Announcements Grid */}
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-16">
            <Cat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500">No announcements found</h3>
            <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                onClick={() => setSelectedAnnouncement(announcement)}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-100 hover:border-orange-200"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={announcement.image}
                    alt={`Photo of ${announcement.name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/f3f4f6/9ca3af?text=No+Photo'
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[announcement.status]}`}>
                      {statusIcons[announcement.status]}
                      {announcement.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                    {announcement.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{announcement.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      <span className="truncate">{announcement.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      <span>{new Date(announcement.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{announcement.color}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{announcement.breed}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Post Announcement Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowForm(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Post Announcement</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex gap-4">
                <label className="flex-1">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Status</span>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'lost' | 'found' })}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white text-gray-700"
                  >
                    <option value="lost">Lost Cat</option>
                    <option value="found">Found Cat</option>
                  </select>
                </label>
                <label className="flex-1">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Cat&apos;s Name</span>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Whiskers"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-700 placeholder-gray-400"
                  />
                </label>
              </div>
              <div className="flex gap-4">
                <label className="flex-1">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Color</span>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="e.g. Orange tabby"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-700 placeholder-gray-400"
                  />
                </label>
                <label className="flex-1">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Breed</span>
                  <input
                    type="text"
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    placeholder="e.g. Domestic Shorthair"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-700 placeholder-gray-400"
                  />
                </label>
              </div>
              <label>
                <span className="block text-sm font-medium text-gray-700 mb-1">Description</span>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the cat's appearance, personality, and any identifying features..."
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-700 placeholder-gray-400 resize-none"
                />
              </label>
              <label>
                <span className="block text-sm font-medium text-gray-700 mb-1">Last Seen Location</span>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Central Park, near the fountain"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-700 placeholder-gray-400"
                  />
                </div>
              </label>
              <div className="flex gap-4">
                <label className="flex-1">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Date</span>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-700"
                  />
                </label>
                <label className="flex-1">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Contact</span>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      placeholder="Phone or email"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-700 placeholder-gray-400"
                    />
                  </div>
                </label>
              </div>
              <label>
                <span className="block text-sm font-medium text-gray-700 mb-1">Photo URL (optional)</span>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/cat-photo.jpg"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-700 placeholder-gray-400"
                />
              </label>
              <button
                type="submit"
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                Post Announcement
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedAnnouncement(null)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedAnnouncement.image}
                alt={`Photo of ${selectedAnnouncement.name}`}
                className="w-full h-64 sm:h-80 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/f3f4f6/9ca3af?text=No+Photo'
                }}
              />
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white rounded-full p-2 hover:bg-black/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute top-4 left-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${statusColors[selectedAnnouncement.status]}`}>
                  {statusIcons[selectedAnnouncement.status]}
                  {selectedAnnouncement.status.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedAnnouncement.name}</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-sm bg-orange-50 text-orange-700 px-3 py-1 rounded-full font-medium">{selectedAnnouncement.color}</span>
                <span className="text-sm bg-orange-50 text-orange-700 px-3 py-1 rounded-full font-medium">{selectedAnnouncement.breed}</span>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">{selectedAnnouncement.description}</p>
              <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Location</div>
                    <div className="text-gray-800 font-medium">{selectedAnnouncement.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Date</div>
                    <div className="text-gray-800 font-medium">
                      {new Date(selectedAnnouncement.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-orange-500" />
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Contact</div>
                    <div className="text-gray-800 font-medium">{selectedAnnouncement.contact}</div>
                  </div>
                </div>
              </div>
              <a
                href={`tel:${selectedAnnouncement.contact}`}
                className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 no-underline"
              >
                <Phone className="w-5 h-5" />
                Contact Now
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Cat className="w-6 h-6 text-orange-400" />
              <span className="text-white font-semibold">Lost Cats Finder</span>
            </div>
            <p className="text-sm text-center sm:text-right">
              Helping reunite cats with their families. Post an announcement today.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
