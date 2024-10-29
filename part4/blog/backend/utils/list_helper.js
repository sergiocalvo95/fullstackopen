const _ = require('lodash')

const dummy = (blogs) => {
    return 1
  }
  
const totalLikes = (blogs) => {
    const num_likes = blogs.reduce((sum, blog) => sum+blog.likes, 0)
    return num_likes
}

const favoriteBlog = (blogs) => {
    const favorite = blogs.reduce((max,blog) => {
        return (max.likes>blog.likes) ? max: blog
    }, blogs[0])

    const newFavorite = {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }

    return newFavorite
}

const mostBlogs = (blogs) => {
    const authorCount = _.countBy(blogs, 'author')

    const authorArray = Object.entries(authorCount)

    const [mostBlogsAuthor, maxBlogs] = _.maxBy(authorArray, ([author,count]) => count)

    
    return {
        author: mostBlogsAuthor,
        blogs: maxBlogs
    }
}

const mostLikes = (blogs) => {
    const authorLikes = _.reduce(blogs, (result, blog) => {
        result[blog.author] = (result[blog.author] || 0) + blog.likes;
        return result;
    }, {});

    const authorArray = Object.entries(authorLikes)

    const [mostLikesAuthor, maxLikes] = _.maxBy(authorArray, ([author, likes]) => likes)

    return {
        author: mostLikesAuthor,
        likes: maxLikes
    }
}



  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }