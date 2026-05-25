<?php
/** @var \App\Model\Game[] $games */
/** @var \App\Service\Router $router */

$title = 'Lista gier';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Lista gier</h1>

    <a href="<?= $router->generatePath('game-create') ?>">Dodaj grę</a>

    <ul class="index-list">
        <?php foreach ($games as $game): ?>
            <li><h3><?= $game->getTitle() ?></h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('game-show', ['id' => $game->getId()]) ?>">Szczegóły</a></li>
                    <li><a href="<?= $router->generatePath('game-edit', ['id' => $game->getId()]) ?>">Edytuj</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';