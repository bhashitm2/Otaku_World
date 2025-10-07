// src/components/CharacterCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { formatCharacterData } from "../services/anime";
import FavoriteButton from "./FavoriteButton";

const CharacterCard = ({ character, compact = false }) => {
  const formattedCharacter = formatCharacterData(character);

  if (compact) {
    return (
      <Link
        to={`/characters/${formattedCharacter.id}`}
        className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="flex">
          <img
            src={formattedCharacter.image || "/placeholder-anime.jpg"}
            alt={formattedCharacter.name}
            className="w-16 h-20 object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = "/placeholder-anime.jpg";
            }}
          />
          <div className="p-3 flex-1">
            <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
              {formattedCharacter.name}
            </h4>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              {formattedCharacter.favorites && (
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                  ❤️ {formattedCharacter.favorites.toLocaleString()}
                </span>
              )}
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                👤 Character
              </span>
            </div>
            {formattedCharacter.nicknames &&
              formattedCharacter.nicknames.length > 0 && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                  {formattedCharacter.nicknames.slice(0, 2).join(", ")}
                </p>
              )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/characters/${formattedCharacter.id}`}
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 h-full flex flex-col"
    >
      <div className="relative flex-shrink-0">
        <img
          src={formattedCharacter.image || "/placeholder-anime.jpg"}
          alt={formattedCharacter.name}
          className="w-full h-64 object-cover group-hover:brightness-75 transition-all duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.src = "/placeholder-anime.jpg";
          }}
        />

        {/* Favorites badge */}
        {formattedCharacter.favorites && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-md text-sm font-bold">
            ❤️ {formattedCharacter.favorites.toLocaleString()}
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-2 left-2 bg-indigo-600 text-white px-2 py-1 rounded-md text-xs font-semibold uppercase">
          👤 Character
        </div>

        {/* Action buttons */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <FavoriteButton
            item={{
              ...formattedCharacter,
              mal_id: formattedCharacter.id,
              type: "character",
            }}
            size="sm"
          />
        </div>

        {/* Overlay with quick actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
            <p className="font-semibold mb-2">View Character</p>
            {formattedCharacter.animeography &&
              formattedCharacter.animeography.length > 0 && (
                <p className="text-sm">
                  In {formattedCharacter.animeography.length} anime
                </p>
              )}
            {formattedCharacter.mangaography &&
              formattedCharacter.mangaography.length > 0 && (
                <p className="text-sm">
                  In {formattedCharacter.mangaography.length} manga
                </p>
              )}
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        {/* Character name - fixed height */}
        <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300 h-10 flex items-center">
          {formattedCharacter.name}
        </h3>

        {/* Kanji name - fixed height */}
        <div className="h-5 mb-2">
          {formattedCharacter.nameKanji && (
            <p className="text-xs text-gray-500 line-clamp-1">
              {formattedCharacter.nameKanji}
            </p>
          )}
        </div>

        {/* Nicknames - fixed height */}
        <div className="h-8 mb-2 flex flex-wrap gap-1">
          {formattedCharacter.nicknames &&
            formattedCharacter.nicknames.length > 0 && (
              <>
                {formattedCharacter.nicknames
                  .slice(0, 2)
                  .map((nickname, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full"
                    >
                      {nickname}
                    </span>
                  ))}
                {formattedCharacter.nicknames.length > 2 && (
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    +{formattedCharacter.nicknames.length - 2}
                  </span>
                )}
              </>
            )}
        </div>

        {/* Flexible spacer */}
        <div className="flex-1"></div>

        {/* Anime/Manga count - fixed at bottom */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          {formattedCharacter.animeography &&
            formattedCharacter.animeography.length > 0 && (
              <span className="flex items-center">
                🎌 {formattedCharacter.animeography.length} anime
              </span>
            )}
          {formattedCharacter.mangaography &&
            formattedCharacter.mangaography.length > 0 && (
              <span className="flex items-center">
                📚 {formattedCharacter.mangaography.length} manga
              </span>
            )}
        </div>

        {/* Favorites count - fixed at bottom */}
        {formattedCharacter.favorites && (
          <div className="text-center">
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
              ❤️ {formattedCharacter.favorites.toLocaleString()} favorites
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default CharacterCard;
