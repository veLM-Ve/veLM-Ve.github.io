<?php
namespace App\Model;

use App\Service\Config;

class Game
{
    private ?int $id = null;
    private ?string $title = null;
    private ?string $platform = null;
    private ?string $genre = null;
    private ?int $release_year = null;

    public function getId(): ?int { return $this->id; }
    public function setId(?int $id): Game { $this->id = $id; return $this; }

    public function getTitle(): ?string { return $this->title; }
    public function setTitle(?string $title): Game { $this->title = $title; return $this; }

    public function getPlatform(): ?string { return $this->platform; }
    public function setPlatform(?string $platform): Game { $this->platform = $platform; return $this; }

    public function getGenre(): ?string { return $this->genre; }
    public function setGenre(?string $genre): Game { $this->genre = $genre; return $this; }

    public function getReleaseYear(): ?int { return $this->release_year; }
    public function setReleaseYear(?int $release_year): Game { $this->release_year = $release_year; return $this; }

    public static function fromArray($array): Game
    {
        $game = new self();
        $game->fill($array);
        return $game;
    }

    public function fill($array): Game
    {
        if (isset($array['id']) && !$this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['title'])) {
            $this->setTitle($array['title']);
        }
        if (isset($array['platform'])) {
            $this->setPlatform($array['platform']);
        }
        if (isset($array['genre'])) {
            $this->setGenre($array['genre']);
        }
        if (isset($array['release_year'])) {
            $this->setReleaseYear($array['release_year']);
        }
        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $statement = $pdo->prepare('SELECT * FROM game');
        $statement->execute();

        $games = [];
        foreach ($statement->fetchAll(\PDO::FETCH_ASSOC) as $row) {
            $games[] = self::fromArray($row);
        }
        return $games;
    }

    public static function find($id): ?Game
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $statement = $pdo->prepare('SELECT * FROM game WHERE id = :id');
        $statement->execute(['id' => $id]);

        $row = $statement->fetch(\PDO::FETCH_ASSOC);
        if (!$row) {
            return null;
        }
        return Game::fromArray($row);
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (!$this->getId()) {
            $statement = $pdo->prepare('INSERT INTO game (title, platform, genre, release_year) VALUES (:title, :platform, :genre, :release_year)');
            $statement->execute([
                'title' => $this->getTitle(),
                'platform' => $this->getPlatform(),
                'genre' => $this->getGenre(),
                'release_year' => $this->getReleaseYear(),
            ]);
            $this->setId($pdo->lastInsertId());
        } else {
            $statement = $pdo->prepare('UPDATE game SET title = :title, platform = :platform, genre = :genre, release_year = :release_year WHERE id = :id');
            $statement->execute([
                ':title' => $this->getTitle(),
                ':platform' => $this->getPlatform(),
                ':genre' => $this->getGenre(),
                ':release_year' => $this->getReleaseYear(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $statement = $pdo->prepare('DELETE FROM game WHERE id = :id');
        $statement->execute([':id' => $this->getId()]);
        $this->setId(null);
    }
}