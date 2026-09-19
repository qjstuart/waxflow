# Make Track the primary Library entity

Track is the primary unit of the Library, and the app assigns its own identifier
to every Track. Track is the sole music entity in the Library: Waxflow does not
model a Discogs Release or couple a Track to one. When a DJ selects a tracklist
entry through Discogs search, only its artist and title become app-owned Track
data; Waxflow does not retain how the Track was added. Artist is stored as an
editable string on Track rather than as a separate entity, and Discogs-selected
Tracks remain fully editable. Potential duplicates may be warned about but are
never merged automatically. A Transition is stored as a separate directional
relationship between a source Track and a destination Track rather than as a
list embedded in either Track.
