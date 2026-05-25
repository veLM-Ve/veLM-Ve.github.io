<div class="form-group">
    <label for="title">Tytuł</label>
    <input type="text" id="title" name="game[title]" value="<?= $game ? $game->getTitle() : '' ?>">
</div>

<div class="form-group">
    <label for="platform">Platforma</label>
    <input type="text" id="platform" name="game[platform]" value="<?= $game ? $game->getPlatform() : '' ?>">
</div>

<div class="form-group">
    <label for="genre">Gatunek</label>
    <input type="text" id="genre" name="game[genre]" value="<?= $game ? $game->getGenre() : '' ?>">
</div>

<div class="form-group">
    <label for="release_year">Rok wydania</label>
    <input type="number" id="release_year" name="game[release_year]" value="<?= $game ? $game->getReleaseYear() : '' ?>">
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Zapisz">
</div>