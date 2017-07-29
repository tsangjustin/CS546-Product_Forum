# CS546-Outfit Product Forum
## Team
+ Daniel Heyman
+ Justin Tsang
+ Weronika Zamlynny

## Project Name
Style With Me?  

## Project Proposal
A clothing forum website that allows users to create new and search for existing forum threads that focus on certain clothing brand, type, or outfit. The forum thread provides a platform for users to converse about that brand, type, or outfit and each forum can link sources to purchase those item(s) as well as provide general statistic information regarding those item(s).  

## Backlog

### Core Features
1. User creation and preference modification
2. Create and maintain own forums regarding certain clothing type, brand, or outfit
3. View and comment in other users' forums
4. Allow user to post images of that outfit or clothes
5. Search new forum based on clothing type, brand, or tag(s)
6. Landing page that displays forums sorted by most recent or most popular and can filter by clothing type/tag(s)

### Nice-to-Have Features
1. Link forum to external webpage to purchase and/or scrape info about brand or clothes
2. Display graphs in webpage showing visual of price changes and sales of outfit
3. Get notification when user comments on forum, price update or stock update on outfit

## Project Idea
### 1. General

  - **Primary Features**:
    - Login page
    - Sign up page
    - Landing page will allow users to navigate to certain clothing type (dress, t-shirt, shoes)
    - Create threads and comments
    - View their existing forums and new notifications
  - **Reach Features**:
    - View list of most popular clothing item
    - Prioritize forums (most recent, trending, most popular)
	- Email reset password
	- Password lockout

### 2. Forum

  - **Primary Features**:
    - Create new thread to discuss certain shoe and/or clothing brand/outfit(s)
    - Users can post comments and likes for given thread
    - Use APIs to retrieve price information about clothing
    - All users can search for existing thread based on clothing type/brand
  - **Reach Features**:
    - Scrape Internet for information of sales and price of given product and update daily
    - Display graph of the daily price change
    - Allow multiple clothing items to be tracked in a single feed
    - Get list of suggestions on where to purchase given product
    - Sub threads for comments
    - Comments can contain clothing items as well

### 3. Forum Post Typing

  - **Primary Features**:
    - Tag clothing items with `#clothing_name[clothing_url]`
  - **Reach Feature**:
    - Markdown support
    - Tag users with `@user`

### 4. Clothing Selection

  - **Primary Features**:
    - Using APIs from clothing stores to get thumbnails and links to specific aritcles of clothing
    - User can select thumbnails and create a forum on them
  - **Reach Feature**:
    - User can view what forums already include this article of clothing

## Clothing Resources:
1. Amazon
  - Look into a scraper
2. Or track based on link provided by the user and scan page for prices and thumbnails

## Database Design:
1. Users
  ```javascript
    {
      _id: 'string'
      displayName: 'string',
      email: 'string',
      password: 'string', // hashed
      isMale: 'boolean',
      followedForums: ["string"], // ids of forums
      avatar: "string" // base64 encoding
    }
  ```
2. Forums
  ```javascript
    {
      _id: 'string',
      createdBy: 'string', // id of user
      createdOn: 'date',
      title: 'string',
      label: ['string'],
      contents: 'string',
      clothing: ['string'], // ids of referenced clothing
      likes: ['string'], // ids of users that liked
      comments: [{
          _id: 'string',
          datePosted: 'date',
          contents: 'string',
          user_id: 'string', // id of commenter
          likes: ['string'], // ids of users that liked
          subthreads: [comment_schema] // schema is identical to parent comment object
      } ]
    }
  ```
3. Clothing
  ```javascript
    {
      _id: 'string',
      url: 'string',
      snapshot: 'string', // Base 64
      label: 'string',
      clothingType: 'int', // Enum linked to config file with types?
      prices: [{
        _id: 'string',
        dateScanned: 'date',
        price: 'int'
      }]
    }
  ```

## Additional Tools:
1. React

**TBA**:

2. Flux (stores & dispatching)
