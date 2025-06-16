use swift_rs::{swift};

swift!(fn add(a: i32, b: i32) -> i32);

pub fn add_from_rust(a: i32, b: i32) -> i32 {
    unsafe {    
        add(a, b)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add_from_rust(2, 2);
        assert_eq!(result, 4);
    }
}
