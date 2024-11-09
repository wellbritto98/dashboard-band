import $ from 'jquery';

export default function getArtistId() {
    let artistId = $(".entityLogo .idHolder").text();
    return artistId !== "" && artistId !== null ? artistId : null;
}