"use client"


import { useState, useEffect } from 'react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Github, MessageCircle, Youtube, Twitter, Users, Heart, Star, GitFork, ExternalLink } from 'lucide-react'

interface RepoData {
  stargazers_count: number
  forks_count: number
}

interface CommunityLink {
  name: string
  description: string
  icon: JSX.Element
  url: string
  color: string
}

interface ContributionArea {
  title: string
  description: string
  skills: string[]
  difficulty: string
}

interface Maintainer {
  name: string
  role: string
  avatar: string
  github: string
}

const Community = () => {
  const [repoData, setRepoData] = useState<RepoData>({
    stargazers_count: 2500,
    forks_count: 180
  })

  useEffect(() => {
    fetch('https://api.github.com/repos/BengalEmpire/BanglaScript')
      .then(res => res.json())
      .then((data: RepoData) => {
        setRepoData({
          stargazers_count: data.stargazers_count,
          forks_count: data.forks_count
        })
      })
      .catch(() => {
        // Fallback to defaults if fetch fails
      })
  }, [])

  const formatStars = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  const communityLinks: CommunityLink[] = [
    {
      name: "GitHub Repository",
      description: "Contribute to the codebase, report issues, and submit pull requests",
      icon: <Github className="h-6 w-6" />,
      url: "https://github.com/BengalEmpire/BanglaScript",
      color: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
    }
  ]

  const contributionAreas: ContributionArea[] = [
    {
      title: "Core Development",
      description: "Help improve the BanglaScript transpiler, add new features, and fix bugs",
      skills: ["JavaScript", "Node.js", "Compiler Design"],
      difficulty: "Advanced"
    },
    {
      title: "Documentation",
      description: "Write guides, tutorials, and improve existing documentation",
      skills: ["Technical Writing", "Markdown", "Bengali"],
      difficulty: "Beginner"
    },
    {
      title: "Language Design",
      description: "Help design new syntax features and language improvements",
      skills: ["Language Design", "Bengali Grammar", "Programming Languages"],
      difficulty: "Intermediate"
    },
    {
      title: "Community Support",
      description: "Help other developers on Discord, GitHub issues, and forums",
      skills: ["Communication", "Problem Solving", "Bengali/English"],
      difficulty: "Beginner"
    },
    {
      title: "Testing & QA",
      description: "Write tests, find bugs, and ensure code quality",
      skills: ["Testing", "QA", "JavaScript"],
      difficulty: "Intermediate"
    },
    {
      title: "DevTools & Integrations",
      description: "Build editor plugins, IDE extensions, and development tools",
      skills: ["VS Code Extensions", "Web Development", "APIs"],
      difficulty: "Advanced"
    }
  ]

  const maintainers: Maintainer[] = [
    {
      name: "Mahmud Rahman",
      role: "Lead Developer",
      avatar: "https://2.gravatar.com/avatar/882cec9129f3f848ebbdff9d8772f3fcf28b1d32a7963a43fda536f3f6985f7a?size=256&d=initials",
      github: "mahmud-r-farhan"
    }
  ]

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'Beginner': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
      case 'Intermediate': return 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100'
      case 'Advanced': return 'bg-gray-300 text-black dark:bg-gray-600 dark:text-white'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
        <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 mt-12">
          <div>
            <h1 className="text-4xl font-bold mb-4">Join the BanglaScript Community</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Be part of a growing community of Bengali developers building the future of programming. 
              Whether you're a beginner or an expert, there's a place for you here.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>1 Developer</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4" />
                <span>{repoData.stargazers_count}+ GitHub Stars</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <GitFork className="h-4 w-4" />
                <span>{repoData.forks_count}+ Forks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Community Links */}
        <section className="mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-8 text-center">Connect With Us</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {communityLinks.map((link, index) => (
                <div
                  key={link.name}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${link.color}`}>
                          {link.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{link.name}</h3>
                          <p className="text-muted-foreground text-sm mb-3">{link.description}</p>
                          <p className="text-xs text-muted-foreground mb-4">{formatStars(repoData.stargazers_count)} stars • {repoData.forks_count} forks</p>
                          <Button asChild size="sm">
                            <a href={link.url} target="_blank" rel="noopener noreferrer">
                              Join Now
                              <ExternalLink className="ml-2 h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contribution Areas */}
        <section className="mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-8 text-center">Ways to Contribute</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contributionAreas.map((area, index) => (
                <div
                  key={area.title}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">{area.title}</CardTitle>
                      <Badge className={getDifficultyColor(area.difficulty)} variant="secondary">
                        {area.difficulty}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4">{area.description}</p>
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Required Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {area.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Team */}
        <section className="mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-8 text-center">Meet the Core Team</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {maintainers.map((maintainer, index) => (
                <div
                  key={maintainer.name}
                >
                  <Card className="text-center">
                    <CardContent className="p-6">
                      <img
                        src={maintainer.avatar}
                        alt={maintainer.name}
                        className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                      />
                      <h3 className="font-semibold mb-1">{maintainer.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{maintainer.role}</p>
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={`https://github.com/${maintainer.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="h-3 w-3 mr-1" />
                          GitHub
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section>
          <div>
            <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-950/20 dark:to-gray-900/20 border-gray-200 dark:border-gray-800 mb-8">
              <CardContent className="p-8 text-center">
                <Heart className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Ready to Contribute?</h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Start your journey with BanglaScript today. Check out our contribution guidelines, 
                  join our Discord community, and help us make programming accessible to Bengali speakers worldwide.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <a
                      href="https://github.com/banglascript/banglascript/blob/main/CONTRIBUTING.md"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="mr-2 h-5 w-5" />
                      Contribution Guide
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a
                      href="https://discord.gg/banglascript"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Join Discord
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}

export default Community