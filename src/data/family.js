// The demo family group. Everything here is fictional.
// In the real Roots & Pantry service each family group has its own copy of this, edited from the Family page.
export default {
  "groupName": "Hartley Family",
  "county": "Shropshire",
  "people": [
    { "name": "Nana Mags", "full": "Margaret Hartley", "initials": "NM", "colour": "#8A4FBF", "role": "admin", "age": "adult", "photo": "/people/nana-mags.svg" },
    { "name": "Dave",      "full": "David Hartley",    "initials": "Da", "colour": "#1E2A4A", "role": "admin", "age": "adult", "creator": true, "photo": "/people/dave.svg" },
    { "name": "Priya",     "full": "Priya Hartley",    "initials": "Pr", "colour": "#1F7A4D", "role": "member", "age": "adult", "photo": "/people/priya.svg" },
    { "name": "Sam",       "full": "Sam Hartley",      "initials": "Sa", "colour": "#2F6FDB", "role": "member", "age": "teen", "photo": "/people/sam.svg" },
    { "name": "Lily",      "full": "Lily Hartley",     "initials": "Li", "colour": "#E0301E", "role": "member", "age": "child", "managedBy": "Priya", "photo": "/people/lily.svg" }
  ],
  "categories": [
    "Dinners",
    "Sunday roast & sides",
    "Light bites & lunch",
    "Baking & bread",
    "Desserts & treats",
    "Christmas",
    "Weekend favourites",
    "Nana's classics"
  ],
  "tags": ["Quick", "Veggie", "Kids can make", "Christmas", "Batch cook", "BBQ"]
};
