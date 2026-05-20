// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RitualPuzzle {
    address public owner;
    uint256 public solvePrice = 0.001 ether;

    struct Solve {
        address solver;
        uint256 moves;
        uint256 timestamp;
        uint8 puzzleId;
    }

    Solve[] public solves;
    mapping(address => uint256) public bestMoves;
    mapping(address => uint256) public totalSolves;

    event PuzzleSolved(
        address indexed solver,
        uint256 moves,
        uint256 timestamp,
        uint8 puzzleId
    );

    event PriceUpdated(uint256 newPrice);
    event Withdrawn(address indexed to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function recordSolve(uint8 puzzleId, uint256 moves) external payable {
        require(msg.value >= solvePrice, "Insufficient payment");
        require(moves > 0, "Invalid moves");

        solves.push(Solve({
            solver: msg.sender,
            moves: moves,
            timestamp: block.timestamp,
            puzzleId: puzzleId
        }));

        totalSolves[msg.sender]++;

        if (bestMoves[msg.sender] == 0 || moves < bestMoves[msg.sender]) {
            bestMoves[msg.sender] = moves;
        }

        emit PuzzleSolved(msg.sender, moves, block.timestamp, puzzleId);
    }

    function getLeaderboard(uint256 limit) external view returns (Solve[] memory) {
        uint256 count = solves.length < limit ? solves.length : limit;
        Solve[] memory top = new Solve[](count);
        // Return most recent solves
        for (uint256 i = 0; i < count; i++) {
            top[i] = solves[solves.length - 1 - i];
        }
        return top;
    }

    function getTotalSolves() external view returns (uint256) {
        return solves.length;
    }

    function setSolvePrice(uint256 newPrice) external onlyOwner {
        solvePrice = newPrice;
        emit PriceUpdated(newPrice);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Nothing to withdraw");
        payable(owner).transfer(balance);
        emit Withdrawn(owner, balance);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}
