<?php
/** @var \App\Model\Game $game */
/** @var \App\Service\Router $router */

$title = $game->getTitle();
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $game->getTitle() ?></h1>
    <p>Platforma: <?= $game->getPlatform() ?></p>
    <p>Gatunek: <?= $game->getGenre() ?></p>
    <p>Rok wydania: <?= $game->getReleaseYear() ?></p>

    <ul class="action-list">
        <li><a href="<?= $router->generatePath('game-index') ?>">Wróć do listy</a></li>
        <li><a href="<?= $router->generatePath('game-edit', ['id' => $game->getId()]) ?>">Edytuj</a></li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';