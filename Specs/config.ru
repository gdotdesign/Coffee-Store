require "rubygems"
require "bundler/setup"
Bundler.require(:default)

use Rack::Static, :urls => ['/css', '/js'], :root => 'public'
use Rack::MethodOverride

Store = {}

class Site < Renee::Application

  def say(data = "")
    respond! do
      status 200
      headers({
        :"Content-Type" => "application/json",
      })
      body data.to_json
    end
  end
  
  app do
    
    part "XHR" do
      query :key do |key|
        if key.empty?
          say false
        end
        get do
          if v = Store[key]
            say v
          end
          say false
        end
        post do
          query :value do |value|
            if value
              Store[key] = value
              say true
            end
            say false            
          end
        end
        delete do
          unless Store.has_key?(key)
            say false
          end
          puts 'delete'
          Store.delete(key)
          say true
        end
      end
      say Store.keys
    end
  
    path '/' do
      render! "index.haml"
    end
    path '/coffee-store.js' do
      respond! do
        status 200
        headers({
          :"Cache-Control" => "must-revalidate",
          :Expires =>(Time.now - 2000).utc.rfc2822
        })
        body `../build -p`
      end
    end
    path '/specs.js' do
      respond! do
        status 200
        headers({
          :"Cache-Control" => "must-revalidate",
          :Expires =>(Time.now - 2000).utc.rfc2822
        })
        body CoffeeScript.compile File.read('../Specs/specs.coffee'), :bare => true
      end
    end
  end
end

run Site
