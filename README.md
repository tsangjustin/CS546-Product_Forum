# CS546-Outfit Product Forum
## Team
+ Daniel Heyman
+ Justin Tsang
+ Weronika Zamlynny

## Project Idea
### 1. General

  - **Primary Features**:
    - Login page
    - Sign up page
    - Landing page will allow users to navigate to certain clothing type (dress, t-shirt, shoes)
    - Create forums and comments
    - View their existing forums and new notifications
  - **Reach Features**:
    - View list of most popular clothing item
    - Prioritize forums (most recent, trending, most popular)

### 2. Forum

  - **Primary Features**:
    - Create new thread to discuss certain shoe and/or clothing brand/outfit(s)
    - Users can post comments and likes for given thread
    - Use APIs to retrieve price information about clothing
  - **Reach Features**:
    - Scrape Internet for information of sales and price of given product and update daily
    - Get list of suggestions on where to purchse given product
    - Sub threads for comments

### 3. Clothing Selection

  - **Primary Features**:
    - Using APIs from clothing stores to get thumbnails and links to specific aritcles of clothing
    - User can select thumbnails and create a forum on them
  - **Reach Feature**:      
    - User can view what forums already include this article of clothing

## Clothing Resources:
1. Amazon
  - Look into a scraper

## Database Design:
1. Users
  ```javascript
    {
      _id: 'string'
      displayName: 'string',
      email: 'string',
      password: 'string',
      isMale: 'boolean',
      interestedForums: ["string", "forum_id"],
      avatar: "string" // base64 encoding
    }
  ```
2. Forums
  ```javascript
    {
      _id: 'string',
      createdBy: 'string', // id of user,
      createdOn: 'date',
      label: ['string', 'label'],
      contents: 'string',
      clothing: ['string', "clothing_id"],
      comments: [ 'string', {
          _id: 'string',
          datePosted: 'date',
          contents: 'string',
          user_id: 'string', // id of commenter
          likes: ['string', 'user_id'],
          subthreads: ['object', 'comment'] // Nice to have
      } ]
    }
  ```
3. Clothing
  ```javascript
    {
      _id: 'string',
      url: 'string',
      forums: ['string', 'forum_id'],
      snapshot: 'string', // Base 64
      label: 'string',
      price: 'int'
    }
  ```
