// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

enum Category {
    Textbooks,
    LabManuals,
    Notebooks,
    Stationery,
    Calculators,
    Other
}

enum Condition {
    New,
    LikeNew,
    Good,
    Fair
}

struct Item {
    uint256 id;
    address seller;
    string title;
    string description;
    uint256 price;
    Category category;
    Condition condition;
    string imageURI;
    bool isSold;
    bool isActive;
}

contract CampusMarketplace is Ownable, ReentrancyGuard {
    uint256 public itemCount;
    uint256 public platformFee = 250;

    mapping(uint256 => Item) public items;
    mapping(address => uint256[]) public sellerItems;
    mapping(address => uint256[]) public buyerPurchases;

    event ItemListed(uint256 indexed itemId, address indexed seller, uint256 price);
    event ItemPurchased(uint256 indexed itemId, address indexed buyer);
    event ItemUpdated(uint256 indexed itemId);
    event ItemDeleted(uint256 indexed itemId);

    constructor() Ownable() {}

    function listItem(
        string calldata title,
        string calldata description,
        uint256 price,
        Category category,
        Condition condition,
        string calldata imageURI
    ) external returns (uint256) {
        require(bytes(title).length > 0, "Title required");
        require(price > 0, "Price must be greater than 0");

        itemCount++;
        items[itemCount] = Item({
            id: itemCount,
            seller: msg.sender,
            title: title,
            description: description,
            price: price,
            category: category,
            condition: condition,
            imageURI: imageURI,
            isSold: false,
            isActive: true
        });

        sellerItems[msg.sender].push(itemCount);

        emit ItemListed(itemCount, msg.sender, price);
        return itemCount;
    }

    function markAsSold(uint256 _itemId) external {
        Item storage item = items[_itemId];
        require(item.seller == msg.sender, "Not owner");
        require(!item.isSold, "Already sold");

        item.isSold = true;
        item.isActive = false;
        emit ItemPurchased(_itemId, msg.sender);
    }

    function updateItem(
        uint256 _itemId,
        string calldata title,
        string calldata description,
        uint256 price,
        Category category,
        Condition condition,
        string calldata imageURI
    ) external {
        Item storage item = items[_itemId];
        require(item.seller == msg.sender, "Not owner");
        require(!item.isSold, "Item already sold");

        item.title = title;
        item.description = description;
        item.price = price;
        item.category = category;
        item.condition = condition;
        item.imageURI = imageURI;

        emit ItemUpdated(_itemId);
    }

    function deleteItem(uint256 _itemId) external {
        Item storage item = items[_itemId];
        require(item.seller == msg.sender, "Not owner");
        require(!item.isSold, "Item already sold");

        item.isActive = false;
        emit ItemDeleted(_itemId);
    }

    function getActiveItems() external view returns (Item[] memory) {
        uint256 count;
        for (uint256 i = 1; i <= itemCount; i++) {
            if (items[i].isActive && !items[i].isSold) {
                count++;
            }
        }

        Item[] memory result = new Item[](count);
        uint256 index;
        for (uint256 i = 1; i <= itemCount; i++) {
            if (items[i].isActive && !items[i].isSold) {
                result[index] = items[i];
                index++;
            }
        }
        return result;
    }

    function getItemsByCategory(Category _category) external view returns (Item[] memory) {
        uint256 count;
        for (uint256 i = 1; i <= itemCount; i++) {
            if (items[i].category == _category && items[i].isActive && !items[i].isSold) {
                count++;
            }
        }

        Item[] memory result = new Item[](count);
        uint256 index;
        for (uint256 i = 1; i <= itemCount; i++) {
            if (items[i].category == _category && items[i].isActive && !items[i].isSold) {
                result[index] = items[i];
                index++;
            }
        }
        return result;
    }

    function getItemsByPriceRange(uint256 minPrice, uint256 maxPrice) external view returns (Item[] memory) {
        uint256 count;
        for (uint256 i = 1; i <= itemCount; i++) {
            if (items[i].price >= minPrice && items[i].price <= maxPrice && items[i].isActive && !items[i].isSold) {
                count++;
            }
        }

        Item[] memory result = new Item[](count);
        uint256 index;
        for (uint256 i = 1; i <= itemCount; i++) {
            if (items[i].price >= minPrice && items[i].price <= maxPrice && items[i].isActive && !items[i].isSold) {
                result[index] = items[i];
                index++;
            }
        }
        return result;
    }

    function getItemsByCondition(Condition _condition) external view returns (Item[] memory) {
        uint256 count;
        for (uint256 i = 1; i <= itemCount; i++) {
            if (items[i].condition == _condition && items[i].isActive && !items[i].isSold) {
                count++;
            }
        }

        Item[] memory result = new Item[](count);
        uint256 index;
        for (uint256 i = 1; i <= itemCount; i++) {
            if (items[i].condition == _condition && items[i].isActive && !items[i].isSold) {
                result[index] = items[i];
                index++;
            }
        }
        return result;
    }

    function getSellerItems(address _seller) external view returns (Item[] memory) {
        uint256[] storage ids = sellerItems[_seller];
        Item[] memory result = new Item[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            result[i] = items[ids[i]];
        }
        return result;
    }

    function getBuyerItems(address _buyer) external view returns (Item[] memory) {
        uint256[] storage ids = buyerPurchases[_buyer];
        Item[] memory result = new Item[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            result[i] = items[ids[i]];
        }
        return result;
    }

    function getItem(uint256 _itemId) external view returns (Item memory) {
        return items[_itemId];
    }
}