<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Game;
use App\Service\Router;
use App\Service\Templating;

class GameController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $games = Game::findAll();
        return $templating->render('game/index.html.php', [
            'games' => $games,
            'router' => $router,
        ]);
    }

    public function createAction(?array $requestPost, Templating $templating, Router $router): ?string
    {
        if ($requestPost) {
            $game = Game::fromArray($requestPost);
            $game->save();
            $router->redirect($router->generatePath('game-index'));
            return null;
        }

        $game = new Game();
        return $templating->render('game/create.html.php', [
            'game' => $game,
            'router' => $router,
        ]);
    }

    public function editAction(int $gameId, ?array $requestPost, Templating $templating, Router $router): ?string
    {
        $game = Game::find($gameId);
        if (!$game) {
            throw new NotFoundException("Nie ma gry o id $gameId");
        }

        if ($requestPost) {
            $game->fill($requestPost);
            $game->save();
            $router->redirect($router->generatePath('game-index'));
            return null;
        }

        return $templating->render('game/edit.html.php', [
            'game' => $game,
            'router' => $router,
        ]);
    }

    public function showAction(int $gameId, Templating $templating, Router $router): ?string
    {
        $game = Game::find($gameId);
        if (!$game) {
            throw new NotFoundException("Nie ma gry o id $gameId");
        }

        return $templating->render('game/show.html.php', [
            'game' => $game,
            'router' => $router,
        ]);
    }

    public function deleteAction(int $gameId, Router $router): ?string
    {
        $game = Game::find($gameId);
        if (!$game) {
            throw new NotFoundException("Nie ma gry o id $gameId");
        }

        $game->delete();
        $router->redirect($router->generatePath('game-index'));
        return null;
    }
}