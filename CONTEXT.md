# Vinyl DJ Set Selection

This context helps vinyl DJs capture and retrieve proven track-to-track transitions from the music available to them. Discogs is the primary import source, while manually added music is equally valid in the Transition Graph.

## Language

**Vinyl DJ**:
A person who prepares and performs DJ sets using physical vinyl records.
_Avoid_: User, customer

**App Account**:
A Vinyl DJ's private app-owned identity and data, registered with an email address and password through a managed authentication component. It is independent of Discogs identity and synchronizes the DJ's private Library and Transition Graph across devices.
_Avoid_: Discogs account, Discogs authorization, session

**Discogs API Access**:
The application's server-side authorization to search the global Discogs database using its registered consumer key and secret. It is shared infrastructure and does not connect a Vinyl DJ's personal Discogs account.
_Avoid_: Discogs Connection, App Account, user login

**Library**:
The deliberately selected Tracks known to a Vinyl DJ in the app, whether individually imported from Discogs or added manually. Tracks may come from Releases the Vinyl DJ owns or does not yet own; the Library is not a mirror of the Discogs Collection.
_Avoid_: Discogs Collection, catalogue

**Record Crates**:
The physical containers holding the Releases a Vinyl DJ uses during home practice and performances. The app does not track crate contents or infer Track availability from them.
_Avoid_: Playlist, Discogs folder, digital crate

**Release**:
A particular Discogs-listed edition that provides provenance and distinguishing context for a Release Track. A Release is supporting information rather than the primary unit of the Library.
_Avoid_: Album, master release

**Backup**:
A user-triggered, versioned JSON copy of all app-owned data, including Tracks, Release provenance, Transitions, notes, and Discogs import snapshots. Restoration completely replaces the current App Account data after explicit confirmation and does not depend on the same data remaining available from Discogs; merging, scheduled backups, and cloud destinations are outside the initial product.
_Avoid_: CSV export, report

**Set Preparation**:
The activity of using a Vinyl DJ's remembered Transitions to select records before a DJ performance.
_Avoid_: Playlist planning, crate digging

**Live Selection**:
Choosing a next Track from the Library during a DJ performance, using remembered Transitions rather than a predetermined sequence.
_Avoid_: Improvisation, ad-hoc selection

**MVP Acceptance Target**:
With a realistic personal Library, a Vinyl DJ can find the playing Track and see its outgoing Transition options within 10 seconds, and can record a newly discovered Transition between existing Tracks within 30 seconds, on either phone or laptop.
_Avoid_: Engagement target, creativity score

**Library Search**:
The default destination after sign-in, used to find Tracks within a Vinyl DJ's Library by Artist name or Track title. Results are Tracks regardless of Import Source; BPM and Tags are not search criteria in the initial product. A Track result opens its details and its incoming and outgoing Transitions.
_Avoid_: Discogs search, tag search, BPM search

**Discogs Import Search**:
Searching the global Discogs database from one free-text query, constrained to Release results, to find Artist names, Release titles, or Track titles and select Tracks for the Library. Import is a two-step exception: open a matching Release, then select one or more of its Tracks; only checked Tracks enter the Library, and results are not restricted by Discogs Ownership.
_Avoid_: Library Search, Collection Search

**Primary Navigation**:
The persistent access to Library Search, Discogs Import Search, Add Manual Track, and Backup/Restore. Track details and Transition creation are contextual workflows reached from the Library rather than primary destinations.
_Avoid_: Track tabs, Transition section

**Track**:
A specific playable piece of music, identified by an artist and title, that can be the source or destination of a Transition. It is the primary unit of the Library and may be imported as a Release Track or maintained as a Manual Track.
_Avoid_: Song, recording

**Potential Duplicate**:
A Track being added that appears similar to an existing Library Track by source identity, artist, or title. The app warns and asks for confirmation but never prevents the Vinyl DJ from adding it.
_Avoid_: Invalid Track, confirmed duplicate

**Track Deletion**:
The permanent removal of a Track and all of its incoming and outgoing Transitions. Before confirmation, the app states how many Transitions will be removed; no dangling Transitions remain afterward, and recovery requires a Backup.
_Avoid_: Discogs removal, ownership change

**Import Source**:
The provenance through which a Track entered the Library, initially Discogs or Manual and potentially other providers later. It does not express ownership, availability, audio format, or storage location.
_Avoid_: Media format, file source

**Release Track**:
A Track imported from a specific tracklist position on a particular Discogs Release.
_Avoid_: Song, abstract track

**Manual Track**:
A Track maintained entirely by the app without an active Discogs link, either because it was added manually or because a former Discogs link was deliberately severed. A manually added Manual Track requires a title and artist; the app stores no audio file.
_Avoid_: Unmatched track, orphaned track

**Track Knowledge**:
Optional information authored by a Vinyl DJ about a Track, including BPM, tags, comments, and incoming or outgoing Transitions. Musical key is outside the initial product and may be added in a future iteration.
_Avoid_: Discogs data, imported metadata

**Tag**:
A flexible, user-defined label attached only to a Track.
_Avoid_: Release tag, Transition tag, genre

**Transition**:
A Vinyl DJ's remembered judgement that one Track works especially well when played into another Track. Both Tracks must already belong to the Library; only the source and destination are required, while an optional note may explain qualities such as an outro/intro characteristic. A Transition is directional, and each ordered source/destination pair is unique; a relationship that works both ways consists of two independent Transitions. Its source and destination may be the same Track.
_Avoid_: Recommendation, match

**Self-Transition**:
A Transition whose source and destination are the same Track, representing a mix between multiple playable copies of that Track. It does not assert or validate how many physical copies are present.
_Avoid_: Duplicate Transition, invalid Transition

**Outgoing Transition**:
A Transition viewed from its source Track, answering which Tracks work after the selected Track.
_Avoid_: Next song

**Incoming Transition**:
A Transition viewed from its destination Track, answering which Tracks work before the selected Track.
_Avoid_: Previous song

**Transition Graph**:
The private, user-owned network formed when Tracks in one Vinyl DJ's Library are connected by Transitions. A Track may connect to, or be connected from, many other Tracks.
_Avoid_: Linked list, playlist, community graph
