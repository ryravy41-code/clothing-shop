$urls = @(
  'https://i.pinimg.com/736x/0c/fe/53/0cfe531f5362188f87bc2ce887bbd8b8.jpg',
  'https://i.pinimg.com/75x75_RS/82/8e/89/828e89773733044fb8a76ab7687e89fb.jpg',
  'https://i.pinimg.com/236x/74/56/b1/7456b1b00f6c372f103ae9c0a6708170.jpg',
  'https://i.pinimg.com/236x/88/fb/b1/88fbb11204d0000bc6cd7aa314030b3a.jpg',
  'https://i.pinimg.com/236x/29/f8/fb/29f8fb0aac7501cdc16274aacafed9ed.jpg',
  'https://i.pinimg.com/236x/d7/07/58/d70758a06b795bb7f00c5ac08fa17f7d.jpg',
  'https://i.pinimg.com/474x/74/56/b1/7456b1b00f6c372f103ae9c0a6708170.jpg',
  'https://i.pinimg.com/474x/88/fb/b1/88fbb11204d0000bc6cd7aa314030b3a.jpg',
  'https://i.pinimg.com/474x/29/f8/fb/29f8fb0aac7501cdc16274aacafed9ed.jpg',
  'https://i.pinimg.com/474x/d7/07/58/d70758a06b795bb7f00c5ac08fa17f7d.jpg',
  'https://i.pinimg.com/1200x/0c/fe/53/0cfe531f5362188f87bc2ce887bbd8b8.jpg',
  'https://i.pinimg.com/736x/74/56/b1/7456b1b00f6c372f103ae9c0a6708170.jpg',
  'https://i.pinimg.com/originals/74/56/b1/7456b1b00f6c372f103ae9c0a6708170.jpg',
  'https://i.pinimg.com/736x/88/fb/b1/88fbb11204d0000bc6cd7aa314030b3a.jpg',
  'https://i.pinimg.com/originals/88/fb/b1/88fbb11204d0000bc6cd7aa314030b3a.webp',
  'https://i.pinimg.com/736x/29/f8/fb/29f8fb0aac7501cdc16274aacafed9ed.jpg',
  'https://i.pinimg.com/originals/29/f8/fb/29f8fb0aac7501cdc16274aacafed9ed.jpg',
  'https://i.pinimg.com/736x/d7/07/58/d70758a06b795bb7f00c5ac08fa17f7d.jpg',
  'https://i.pinimg.com/originals/d7/07/58/d70758a06b795bb7f00c5ac08fa17f7d.jpg',
  'https://i.pinimg.com/236x/6f/73/5f/6f735f57be57899d70e906bbd42570e0.jpg',
  'https://i.pinimg.com/60x60/6f/73/5f/6f735f57be57899d70e906bbd42570e0.jpg',
  'https://i.pinimg.com/136x136/6f/73/5f/6f735f57be57899d70e906bbd42570e0.jpg',
  'https://i.pinimg.com/474x/6f/73/5f/6f735f57be57899d70e906bbd42570e0.jpg',
  'https://i.pinimg.com/564x/6f/73/5f/6f735f57be57899d70e906bbd42570e0.jpg',
  'https://i.pinimg.com/736x/6f/73/5f/6f735f57be57899d70e906bbd42570e0.jpg',
  'https://i.pinimg.com/600x315/6f/73/5f/6f735f57be57899d70e906bbd42570e0.jpg',
  'https://i.pinimg.com/1200x/6f/73/5f/6f735f57be57899d70e906bbd42570e0.jpg',
  'https://i.pinimg.com/originals/6f/73/5f/6f735f57be57899d70e906bbd42570e0.png',
  'https://i.pinimg.com/75x75_RS/cf/4c/99/cf4c9965d675051c01e6dbbbc596aad1.jpg',
  'https://i.pinimg.com/30x30_RS/cf/4c/99/cf4c9965d675051c01e6dbbbc596aad1.jpg',
  'https://i.pinimg.com/75x75_RS/79/26/8d/79268d5c7197d83095a2ff09564015ea.jpg',
  'https://i.pinimg.com/30x30_RS/79/26/8d/79268d5c7197d83095a2ff09564015ea.jpg',
  'https://i.pinimg.com/200x150/41/75/48/417548cf8e03d7b71448cf34324005e1.jpg'
)

$dir = 'D:\ETEC CENTER\vuetypescrit\my-project\public\images\men'
$idx = 0
foreach ($url in $urls) {
    $idx++
    $ext = [System.IO.Path]::GetExtension($url)
    $name = 'm{0:D3}{1}' -f ($idx + 60), $ext
    $path = Join-Path $dir $name
    try {
        Invoke-WebRequest -Uri $url -OutFile $path -ErrorAction SilentlyContinue
        Write-Output ("OK {0}/{1}: {2}" -f $idx, $urls.Count, $name)
    } catch {
        Write-Output ("FAIL {0}/{1}: {2}" -f $idx, $urls.Count, $name)
    }
}
Write-Output ("Done. {0} images." -f $idx)
