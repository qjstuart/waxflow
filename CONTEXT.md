# DJ Transition Memory

This context helps DJs remember personally tested Track-to-Track combinations so they can retrieve them during practice, set preparation, or performance. DJs can enter a Track manually or use Discogs search to avoid typing its artist and title.

## Language

**DJ**:
A person who prepares or performs DJ sets, regardless of whether they use vinyl, digital media, or a combination.
_Avoid_: Vinyl DJ, user, customer

**Account**:
A DJ's private Waxflow identity and data, registered with an email address and password. It is independent of Discogs identity and makes the DJ's private Library and Transitions available across devices.
_Avoid_: Discogs account, Discogs authorization, session

**Trusted Device**:
A private device or browser profile on which a DJ has explicitly allowed Waxflow to retain Account data for offline reading. A shared or public device is not a Trusted Device.
_Avoid_: Authenticated device, remembered device

**Library**:
The Tracks a DJ deliberately saves in Waxflow, either by adding them manually or selecting them through Discogs Search. Library membership does not express ownership, availability, playback medium, or physical location.
_Avoid_: Discogs Collection, catalogue

**Library Search**:
The default destination after sign-in, used to find Tracks within a DJ's Library. It returns only Track results and matches case-insensitive artist, title, Track Note, and Transition Note text. A Transition Note match returns both participating Tracks without explaining why they matched, while a Self-Transition returns its Track once. Each distinct Track record appears at most once even when several values match; deliberately separate Potential Duplicates remain separate results. BPM is not a search criterion in the initial product. A Track result opens its details and the Tracks that work before or after it.
_Avoid_: Discogs Search, BPM search

**Discogs Search**:
Searching the global Discogs database from one free-text query to select Tracks for the Library instead of entering each Track manually. A DJ opens a matching Release result and selects one or more tracklist entries, but Waxflow retains only each selected artist and Track title and does not add the Release or the addition method to the Library.
_Avoid_: Library Search, Collection Search

**Track**:
A specific playable piece of music with a required, editable artist string and title, plus an optional positive integer BPM and Track Note. It can be the source or destination of a Transition and is the sole music entity in the Library regardless of whether the DJ entered it manually or selected it through Discogs search; Artist is not a separate Waxflow entity.
_Avoid_: Song, recording

**Track Note**:
One optional free-text field containing anything a DJ wants to remember about a Track.
_Avoid_: Track comment, comments

**Potential Duplicate**:
A Track being added or edited with the same artist and title as an existing Library Track under the product's exact-match check. The app warns and asks for confirmation but never merges Tracks or prevents the DJ from saving one.
_Avoid_: Invalid Track, confirmed duplicate

**Track Deletion**:
The permanent removal of a Track and every Transition in which it is the source or destination. Before confirmation, the app states how many Transitions will be removed; no dangling Transitions remain afterward, and the initial product provides no recovery.
_Avoid_: Discogs removal, ownership change

**Transition**:
A separate relationship recording a DJ's judgement that one Track works especially well when played into another Track. Both Tracks must already belong to the Library; only the source and destination are required, while one optional Transition Note may describe any variations or useful technique. Its source, destination, and Transition Note are editable; the interface entry point for editing is not part of the domain model. It can be deleted from either Track after confirmation. A Transition is directional, and each ordered source/destination pair is unique; an edit that would duplicate an existing pair is rejected. A relationship that works both ways consists of two independent Transitions, and its source and destination may be the same Track.
_Avoid_: Recommendation, match

**Transition Note**:
One optional free-text field containing anything a DJ wants to remember about a Transition, including variations or technique.
_Avoid_: Transition comment, comments

**Self-Transition**:
A Transition whose source and destination are the same Track, representing a mix between multiple playable copies of that Track. It does not assert or validate how many physical copies are present.
_Avoid_: Duplicate Transition, invalid Transition
